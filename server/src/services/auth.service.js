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

  // Google-only accounts have no password — bcrypt.compare would crash
  if (!user.password) {
    throw new ApiError(401, 'This account uses Google sign-in. Please continue with Google.');
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
 * Takes a Google OAuth access token (from the @react-oauth/google token flow),
 * verifies it by fetching the user's profile from Google, then logs in/registers.
 * The token flow works without third-party cookies (unlike the GIS button).
 */
export const googleAuth = async (googleAccessToken) => {
  if (!googleAccessToken) throw new ApiError(400, 'Google access token is required');

  let payload;
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });
    if (!res.ok) throw new Error(`userinfo ${res.status}`);
    payload = await res.json();
  } catch (error) {
    console.error('Google Auth Error:', error.message);
    throw new ApiError(401, 'Google sign-in failed');
  }

  const { email, name, sub: googleId } = payload;
  if (!email) throw new ApiError(401, 'Google account has no email');

  let user = await User.findOne({ email });

  if (!user) {
    // Create a new user (password is optional in the schema for Google accounts)
    user = await User.create({ name: name || email.split('@')[0], email, googleId });
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
};
