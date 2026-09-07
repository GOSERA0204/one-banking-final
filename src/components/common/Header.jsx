import { useEffect, useState } from "react";
import { checkServerConnection } from "../../api/bankingApi";

export default function Header() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      const connected = await checkServerConnection();
      if (!cancelled) setIsConnected(connected);
    };

    check();
    const intervalId = setInterval(check, 15000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <header className="app-header">
      <div className="logo-area">
        <span className="logo-icon">W</span>
        <h1 className="logo-text">WON 실습뱅킹</h1>
        <span
          className={`api-status-dot ${isConnected ? "connected" : "disconnected"}`}
          role="status"
          aria-label={isConnected ? "API 연동됨" : "API 연동 안 됨"}
          title={isConnected ? "API 연동됨" : "API 연동 안 됨 (더미 데이터 모드)"}
        />
      </div>
      <div className="header-actions">
        <button type="button" className="icon-btn" aria-label="알림">🔔</button>
        <button type="button" className="icon-btn" aria-label="전체 메뉴">☰</button>
      </div>
    </header>
  );
}
