import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '40px 24px',
      background: '#FDF8F9',
    }}>
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '88px',
        fontWeight: 600,
        color: '#C4005A',
        lineHeight: 1,
        letterSpacing: '-0.04em',
      }}>
        404
      </h1>
      <p style={{
        fontSize: '16px',
        color: '#9A8088',
        margin: '16px 0 32px',
        lineHeight: 1.6,
      }}>
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '14px 28px',
        background: '#C4005A',
        color: '#fff',
        borderRadius: '4px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        transition: 'opacity 0.2s',
      }}>
        Go Home
      </Link>
    </section>
  );
};

export default NotFound;
