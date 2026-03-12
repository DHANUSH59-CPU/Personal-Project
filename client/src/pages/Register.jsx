import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { useRegisterMutation, useGoogleLoginMutation } from '../api/authApi';
import { setCredentials } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLogin({ idToken: credentialResponse.credential }).unwrap();
      dispatch(setCredentials({ user: res.data.user, accessToken: res.data.accessToken }));
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err?.data?.message || 'Google registration failed');
    }
  };

  return (
    <section className="container" style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - var(--nav-height) - 200px)', padding: 'var(--space-2xl) 0',
    }}>
      <div style={{
        width: '100%', maxWidth: 420, background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)', padding: 'var(--space-2xl)',
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border-light)',
      }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: 'var(--space-xs)', textAlign: 'center' }}>
          Create Account
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginBottom: 'var(--space-xl)', fontSize: '0.9rem' }}>
          Join PadCare for a better shopping experience
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: 4, color: 'var(--color-text-secondary)' }}>Full Name</label>
            <input id="register-name" type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
              placeholder="Your name" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: 4, color: 'var(--color-text-secondary)' }}>Email</label>
            <input id="register-email" type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
              placeholder="you@email.com" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: 4, color: 'var(--color-text-secondary)' }}>Phone (optional)</label>
            <input id="register-phone" type="tel" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
              placeholder="+91 98765 43210" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: 4, color: 'var(--color-text-secondary)' }}>Password</label>
            <input id="register-password" type="password" required minLength={6} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.95rem' }}
              placeholder="Min 6 characters" />
          </div>
          <button id="register-submit" type="submit" disabled={isLoading}
            style={{ padding: '14px', background: 'var(--gradient-primary)', color: 'white', borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '1rem', marginTop: 'var(--space-sm)', cursor: 'pointer', boxShadow: 'var(--shadow-primary)' }}>
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div style={{ margin: 'var(--space-lg) 0', display: 'flex', alignItems: 'center', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
          <hr style={{ flex: 1, borderTop: '1px solid var(--color-border-light)' }} />
          <span style={{ padding: '0 10px' }}>OR</span>
          <hr style={{ flex: 1, borderTop: '1px solid var(--color-border-light)' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error('Google Sign-In was unsuccessful')}
            shape="rectangular"
            theme="outline"
            size="large"
            text="signup_with"
            width="100%"
          />
        </div>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
