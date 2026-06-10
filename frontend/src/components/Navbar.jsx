const Navbar = () => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85), rgba(26, 10, 46, 0.85))',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(0, 217, 255, 0.15)',
      padding: '1.2rem 2rem',
      boxShadow: '0 8px 32px rgba(0, 217, 255, 0.08)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
      }}>
        <div>
          <p style={{
            margin: '0 0 0.3rem 0',
            fontSize: '0.8rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            background: 'linear-gradient(135deg, #00d9ff, #8338ec)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            DocuMind Enterprise
          </p>
          <h2 style={{
            margin: '0',
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#fff',
          }}>
            AI-Powered PDF Intelligence
          </h2>
        </div>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.15), rgba(131, 56, 236, 0.15))',
          color: '#00d9ff',
          padding: '0.7rem 1.2rem',
          borderRadius: '999px',
          fontSize: '0.9rem',
          fontWeight: '600',
          border: '1px solid rgba(0, 217, 255, 0.3)',
          whiteSpace: 'nowrap',
        }}>
          ✨ Smart AI Chat
        </div>
      </div>
    </header>
  );
};

export default Navbar;
