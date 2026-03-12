import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';

/**
 * Generate access and refresh tokens for a user.
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });
  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  });
  return { accessToken, refreshToken };
};

/**
 * Register a new user.
 */
export const registerUser = async ({ name, email, password, phone }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password, phone });
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Store refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

/**
 * Login a user.
 */
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

/**
 * Logout a user (clear refresh token).
 */
export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: '' });
};

/**
 * Refresh access token using refresh token.
 */
export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  try {
    const decoded = jwt.verify(incomingRefreshToken, env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
};

/**
 * Google Authentication.
 */
export const googleAuth = async (idToken) => {
  const { OAuth2Client } = await import('google-auth-library');
  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if not exists
      user = await User.create({
        name,
        email,
        googleId,
        // Using a random placeholder password since it's now optional/handled by pre-save
        // but we made it optional in the schema so it's fine
      });
    } else if (!user.googleId) {
      // Link Google account to existing email user
      user.googleId = googleId;
      await user.save({ validateBeforeSave: false });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
  } catch (error) {
    console.error('Google Auth Error:', error);
    throw new ApiError(401, 'Google sign-in failed');
  }
};
