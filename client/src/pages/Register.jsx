import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { useRegisterMutation, useGoogleLoginMutation } from '../api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import styles from '../styles/pages/Auth.module.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [register, { isLoading }] = useRegisterMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form).unwrap();
      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  // OAuth token flow — works without third-party cookies (unlike the GIS button)
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleLogin({ accessToken: tokenResponse.access_token }).unwrap();
        dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
        toast.success('Account created successfully!');
        navigate('/');
      } catch (err) {
        toast.error(err?.data?.message || 'Google registration failed');
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
          <h1 className={styles.authTitle}>Create Account</h1>
          <p className={styles.authSub}>Join us for a better experience</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              id="register-name"
              className="form-input"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="register-email"
              className="form-input"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@email.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone <span className={styles.optionalTag}>(optional)</span></label>
            <input
              id="register-phone"
              className="form-input"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="register-password"
              className="form-input"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
            />
          </div>
          <button
            id="register-submit"
            type="submit"
            disabled={isLoading}
            className={styles.authSubmit}
          >
            {isLoading ? 'Creating…' : 'Create Account'}
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
            Sign up with Google
          </button>
        </div>

        <p className={styles.authSwitch}>
          Already have an account?{' '}
          <Link to="/login" className={styles.authSwitchLink}>Sign In</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
