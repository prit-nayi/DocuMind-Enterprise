const Navbar = () => {
  return (
    <nav className="dm-navbar">
      <div className="dm-nav-left">
        <div className="dm-logo-icon">🧠</div>
        <span className="dm-logo-text">Docu<span>Mind</span></span>
        <span className="dm-badge">ENTERPRISE</span>
      </div>
      <div className="dm-nav-right">
        <div className="dm-status-dot"></div>
        <span>System Online</span>
      </div>
    </nav>
  );
};

export default Navbar;
