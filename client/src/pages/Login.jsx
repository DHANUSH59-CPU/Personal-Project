import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginMutation, useGoogleLoginMutation } from '../api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import styles from '../styles/pages/Auth.module.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form).unwrap();
      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLogin({ idToken: credentialResponse.credential }).unwrap();
      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Google login failed');
    }
  };

  return (
    <section className={styles.authPage}>
      <div className={styles.authCard}>
        {/* Header */}
        <div className={styles.authHeader}>
          <div className={styles.authLogo}>NewFeel</div>
          <h1 className={styles.authTitle}>Welcome Back</h1>
          <p className={styles.authSub}>Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@email.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="login-password"
              className="form-input"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••"
            />
          </div>
          <button
            id="login-submit"
            type="submit"
            disabled={isLoading}
            className={styles.authSubmit}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or</span>
          <span className={styles.dividerLine} />
        </div>

        {/* Google */}
        <div className={styles.googleWrap}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Sign-In was unsuccessful')}
            shape="rectangular"
            theme="outline"
            size="large"
            text="continue_with"
            width="100%"
          />
        </div>

        <p className={styles.authSwitch}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.authSwitchLink}>Register</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
