import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { key: 'home', to: '/', icon: '🏠', label: '홈' },
  { key: 'transfer', to: '/transfer', icon: '💸', label: '이체' },
  { key: 'history', to: '/history', icon: '📋', label: '거래내역' },
  { key: 'all', to: '/all', icon: '⋯', label: '전체' }
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.to;
        return (
          <Link
            key={item.key}
            to={item.to}
            className={`nav-item${isActive ? ' active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
