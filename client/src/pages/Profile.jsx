import { useState } from 'react';
import { FiUser, FiLock, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { useUpdateProfileMutation, useChangePasswordMutation } from '../api/userApi';
import styles from '../styles/pages/Profile.module.css';

const Profile = () => {
  const { user } = useAuth();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: changingPw }] = useChangePasswordMutation();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ── Update Profile ────────────────────────
  const handleProfileSave = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() }).unwrap();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update profile');
    }
  };

  // ── Change Password ───────────────────────
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password');
    }
  };

  if (!user) {
    return (
      <section className={`container ${styles.profilePage}`}>
        <div className={styles.loading}>Loading profile...</div>
      </section>
    );
  }

  return (
    <section className={`container ${styles.profilePage}`}>
      <h1 className={styles.title}>My Profile</h1>

      {/* Profile Info */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <FiUser size={18} /> Personal Information
        </h2>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Name</label>
            <input
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              maxLength={10}
            />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Email</label>
            <input
              className={`${styles.input} ${styles.inputDisabled}`}
              value={user.email}
              disabled
            />
          </div>
        </div>
        <button className={styles.saveBtn} onClick={handleProfileSave} disabled={updating}>
          <FiSave size={16} /> {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Change Password */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>
          <FiLock size={18} /> Change Password
        </h2>
        <div className={styles.formGrid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label className={styles.label}>Current Password</label>
            <input
              className={styles.input}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>New Password</label>
            <input
              className={styles.input}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Confirm Password</label>
            <input
              className={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
            />
          </div>
        </div>
        <button className={styles.saveBtn} onClick={handlePasswordChange} disabled={changingPw}>
          <FiLock size={16} /> {changingPw ? 'Changing...' : 'Change Password'}
        </button>
      </div>
    </section>
  );
};

export default Profile;
