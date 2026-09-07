const NAV_ITEMS = [
  { key: 'home', href: '../../../index.html', icon: '🏠', label: '홈' },
  { key: 'transfer', href: '#', icon: '💸', label: '이체' },
  { key: 'history', href: '../../../history.html', icon: '📋', label: '거래내역' },
  { key: 'all', href: '#none', icon: '⋯', label: '전체' }
];

export default function BottomNav({ active }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => {
        const isActive = item.key === active;
        return (
          <a
            key={item.key}
            href={item.href}
            className={`nav-item${isActive ? ' active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
