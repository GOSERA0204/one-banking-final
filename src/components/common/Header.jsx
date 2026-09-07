export default function Header() {
  return (
    <header className="app-header">
      <div className="logo-area">
        <span className="logo-icon">W</span>
        <h1 className="logo-text">WON 실습뱅킹</h1>
      </div>
      <div className="header-actions">
        <button type="button" className="icon-btn" aria-label="알림">🔔</button>
        <button type="button" className="icon-btn" aria-label="전체 메뉴">☰</button>
      </div>
    </header>
  );
}
