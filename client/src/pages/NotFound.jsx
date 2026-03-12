import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', textAlign: 'center', padding: 'var(--space-2xl)',
    }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '6rem', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1 }}>
        404
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', margin: 'var(--space-md) 0 var(--space-xl)' }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" style={{
        padding: '12px 28px', background: 'var(--gradient-primary)', color: 'white',
        borderRadius: 'var(--radius-md)', fontWeight: 600, boxShadow: 'var(--shadow-primary)',
      }}>
        Go Home
      </Link>
    </section>
  );
};

export default NotFound;
