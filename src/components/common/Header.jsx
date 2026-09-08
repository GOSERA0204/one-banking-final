import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkServerConnection } from "../../api/bankingApi";

// [달라진 점 1: 모달 컴포넌트 불러오기]
// 같은 폴더(src/components/common/)에 새로 만든 NotificationModal 파일을 가져옵니다.
import NotificationModal from "./NotificationModal";

export default function Header() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);

  // [달라진 점 2: 모달 열림/닫힘 상태(State) 생성]
  // isNotiOpen이 true이면 알림창이 화면에 뜨고, false이면 숨겨집니다. (기본값은 닫힌 상태: false)
  const [isNotiOpen, setIsNotiOpen] = useState(false);

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
    // [달라진 점 3: React Fragment (<> ... </>) 감싸기]
    // React 컴포넌트는 최상단에 단 1개의 부모 태그만 리턴해야 합니다.
    // 기존에는 <header> 하나뿐이었지만, 이제 <NotificationModal>도 함께 렌더링해야 하므로
    // 불필요한 <div>를 더 생성하지 않고 묶어주는 빈 태그(<></>)로 감쌌습니다.
    <>
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
          {/* 
            [달라진 점 4: 종 모양 버튼(🔔)에 클릭 이벤트(onClick) 추가]
            원래는 아무 동작도 하지 않는 단순 버튼이었지만,
            클릭할 때 setIsNotiOpen(true)를 실행하여 알림창 상태를 '열림'으로 바꿉니다.
          */}
          <button
            type="button"
            className="icon-btn"
            aria-label="알림"
            onClick={() => setIsNotiOpen(true)}
          >
            🔔
          </button>
          <button
            type="button"
            className="icon-btn"
            aria-label="전체 메뉴"
            onClick={() => navigate('/all')}
          >
            ☰
          </button>
        </div>
      </header>

      {/* 
        [달라진 점 5: 알림 모달 배치 및 Props 전달]
        1. isOpen={isNotiOpen}
           - 모달에게 현재 열려야 하는지(true) 닫혀야 하는지(false) 상태를 전달합니다.
           - 모달 파일 안에서 `if (!isOpen) return null;`을 실행해 렌더링 여부를 결정합니다.
        2. onClose={() => setIsNotiOpen(false)}
           - 모달 내부의 '닫기 버튼'이나 '어두운 배경(overlay)'을 클릭했을 때 실행할 함수를 넘겨줍니다.
           - 이 함수가 실행되면 isNotiOpen이 false로 바뀌며 모달이 닫힙니다.
      */}
      <NotificationModal
        isOpen={isNotiOpen}
        onClose={() => setIsNotiOpen(false)}
      />
    </>
  );
}