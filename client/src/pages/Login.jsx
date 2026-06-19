import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
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

  // OAuth token flow — works without third-party cookies (unlike the GIS button)
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleLogin({ accessToken: tokenResponse.access_token }).unwrap();
        dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
        toast.success('Welcome back!');
        navigate('/');
      } catch (err) {
        toast.error(err?.data?.message || 'Google login failed');
      }
    },
    onError: () => toast.error('Google Sign-In was unsuccessful'),
  });

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
          <button type="button" className={styles.googleBtn} onClick={() => triggerGoogleLogin()}>
            <FcGoogle size={20} />
            Continue with Google
          </button>
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
