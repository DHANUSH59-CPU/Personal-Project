import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as userService from '../services/user.service.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  res.status(200).json(new ApiResponse(200, user));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateUserProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, user, 'Profile updated'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await userService.changePassword(req.user._id, currentPassword, newPassword);
  res.status(200).json(new ApiResponse(200, result));
});

// Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const data = await userService.getAllUsers(page, limit);
  res.status(200).json(new ApiResponse(200, data));
});
