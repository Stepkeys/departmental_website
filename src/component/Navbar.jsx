
import { useState } from 'react';
import '../style/Navbar.css';

const links = [
  { label: 'Home', path: '/' },
  { label: 'Staff & Exco', path: '/staff-exco' },
  { label: 'Projects', path: '/project' },
  { label: 'Events', path: '/events' },
  { label: 'More info', path: '/more-info' },
];

export default function Navbar({ activePath, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNavigate(event, path) {
    onNavigate(event, path);
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <a className="brand" href="/" onClick={(event) => handleNavigate(event, '/')}>
        <img className="brand-logo" src="/nadss-logo.png" alt="" />
        <span className="brand-copy"><strong>NADSS</strong><small>Nigeria Association of Data Science Students @ UniOsun-main-campus</small></span>
      </a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
        <span /><span />
      </button>
      <nav className={`main-nav${menuOpen ? ' nav-open' : ''}`} aria-label="Main navigation">
        {links.map(({ label, path }) => (
          <a className={activePath === path ? 'nav-link active' : 'nav-link'} href={path} aria-current={activePath === path ? 'page' : undefined} onClick={(event) => handleNavigate(event, path)} key={path}>{label}</a>
        ))}
        <a className={activePath === '/admin' ? 'admin-link active' : 'admin-link'} href="/admin" aria-current={activePath === '/admin' ? 'page' : undefined} onClick={(event) => handleNavigate(event, '/admin')}>Admin <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}