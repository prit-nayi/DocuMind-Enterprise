import { BellIcon, LogoIcon, MenuIcon, SettingsIcon, SparkleIcon } from "./Icons";

const Navbar = ({ onMenuToggle }) => {
  return (
    <header className="top-navbar">
      <div className="navbar-brand">
        <button
          type="button"
          className="icon-btn mobile-menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <MenuIcon />
        </button>

        <div className="navbar-logo">
          <LogoIcon />
        </div>

        <div className="navbar-title">
          <span>DocuMind</span>
          <span>Enterprise</span>
        </div>
      </div>

      <div className="navbar-actions">
        <span className="navbar-badge">
          <SparkleIcon />
          RAG Engine Active
        </span>

        <span className="navbar-badge">
          <span className="live-dot" />
          Live
        </span>

        <button type="button" className="icon-btn" aria-label="Settings">
          <SettingsIcon />
        </button>

        <button type="button" className="icon-btn" aria-label="Notifications">
          <BellIcon />
        </button>

        <div className="navbar-avatar" aria-label="User profile">
          DM
        </div>
      </div>
    </header>
  );
};

export default Navbar;
