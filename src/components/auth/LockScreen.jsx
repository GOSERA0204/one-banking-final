import { useEffect, useState } from 'react';
import '../../styles/lockscreen.css';

// 데모용 간편비밀번호 (실서비스라면 서버 인증으로 대체됩니다)
const DEMO_PIN = '123456';

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['backspace', '0', 'confirm']
];

export default function LockScreen({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // 6자리 입력 완료 시 자동으로 검증합니다.
  useEffect(() => {
    if (pin.length < 6) return undefined;
    const timer = setTimeout(() => {
      if (pin === DEMO_PIN) {
        onUnlock();
      } else {
        setError('비밀번호가 일치하지 않습니다');
        setIsShaking(true);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [pin, onUnlock]);

  // 흔들림 애니메이션 종료 후 입력값을 초기화해 재입력을 받습니다.
  useEffect(() => {
    if (!isShaking) return undefined;
    const timer = setTimeout(() => {
      setIsShaking(false);
      setPin('');
    }, 420);
    return () => clearTimeout(timer);
  }, [isShaking]);

  function handleDigit(digit) {
    if (isShaking || pin.length >= 6) return;
    setError('');
    setPin((prev) => prev + digit);
  }

  function handleBackspace() {
    if (isShaking) return;
    setError('');
    setPin((prev) => prev.slice(0, -1));
  }

  function handleConfirm() {
    if (pin.length !== 6 || isShaking) return;
    if (pin === DEMO_PIN) {
      onUnlock();
    } else {
      setError('비밀번호가 일치하지 않습니다');
      setIsShaking(true);
    }
  }

  return (
    <div className="lock-screen">
      <div className="lock-logo-area">
        <span className="lock-logo-icon">W</span>
        <h1 className="lock-logo-text">WON 실습뱅킹</h1>
      </div>

      <p className="lock-guide-text">간편비밀번호 6자리를 입력해주세요.</p>

      <div className={`lock-indicator-row${isShaking ? ' shake' : ''}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={`lock-indicator-dot${i < pin.length ? ' filled' : ''}${error ? ' error' : ''}`}
          />
        ))}
      </div>

      <p className={`lock-error-text${error ? ' visible' : ''}`}>{error || ' '}</p>

      <div className="lock-keypad">
        {KEYPAD_ROWS.map((row, i) => (
          <div key={i} className="lock-keypad-row">
            {row.map((key) => {
              if (key === 'backspace') {
                return (
                  <button
                    key={key}
                    type="button"
                    className="lock-key lock-key-func"
                    onClick={handleBackspace}
                    aria-label="한 글자 지우기"
                  >
                    ⌫
                  </button>
                );
              }
              if (key === 'confirm') {
                return (
                  <button
                    key={key}
                    type="button"
                    className="lock-key lock-key-func"
                    onClick={handleConfirm}
                    disabled={pin.length !== 6}
                  >
                    확인
                  </button>
                );
              }
              return (
                <button
                  key={key}
                  type="button"
                  className="lock-key"
                  onClick={() => handleDigit(key)}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <button type="button" className="lock-forgot-link">
        비밀번호를 잊으셨나요?
      </button>

      <p className="lock-demo-hint">(데모용 비밀번호: {DEMO_PIN})</p>
    </div>
  );
}
