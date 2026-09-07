import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/transfer.css';

const BANK_LABELS = {
  woori: '우리은행',
  kb: '국민은행',
  shinhan: '신한은행',
  hana: '하나은행',
  kakao: '카카오뱅크'
};

const TEST_ACCOUNTS = [
  { code: '1002123456789', owner: '김민준', bank: 'woori' },
  { code: '1002987654321', owner: '이서연', bank: 'woori' },
  { code: '1102555666777', owner: '박지훈', bank: 'kb' }
];

// 현재 로그인한 사용자(김민준님) 소유 계좌 — "내 계좌"로 바로 골라 보낼 수 있게 합니다.
const MY_ACCOUNT = TEST_ACCOUNTS[0];
// 최근에 이체한 적 있는 상대 계좌 목록
const RECENT_TRANSFERS = TEST_ACCOUNTS.slice(1);
const AVATAR_COLORS = ['#0066cc', '#8b5e34', '#14875a', '#c07a17'];

const WITHDRAW_ACCOUNTS = [
  { id: 'woori-1', nickname: '우리 첫급여통장', accountNo: '1002-***-123456', balance: 2384560 },
  { id: 'woori-2', nickname: '우리 SUPER주거래통장', accountNo: '1002-***-789012', balance: 15200000 },
  { id: 'woori-3', nickname: '우리 청년도약계좌', accountNo: '1002-***-456789', balance: 5000000 }
];

function won(amount) {
  return `${amount.toLocaleString()}원`;
}

export default function TransferPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [withdrawAccountId, setWithdrawAccountId] = useState(WITHDRAW_ACCOUNTS[0].id);
  const [receivingBank, setReceivingBank] = useState('woori');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');

  const withdrawAccount = WITHDRAW_ACCOUNTS.find((acc) => acc.id === withdrawAccountId);

  // 계좌번호로 등록된 테스트 계좌를 찾고, 선택된 은행까지 일치할 때만 예금주로 인정합니다.
  const accountByNumber = TEST_ACCOUNTS.find((acc) => acc.code === accountNumber);
  const matchedAccount = accountByNumber && accountByNumber.bank === receivingBank ? accountByNumber : null;
  // 계좌번호를 다 입력했는데도 등록된 계좌가 아니거나(계좌번호 자체가 없거나) 은행이 다르면 동일한 오류로 처리합니다.
  const hasInvalidAccount = accountNumber.length >= 10 && !matchedAccount;
  const isAccountVerified = Boolean(matchedAccount);

  const numericAmount = Number(amount);
  let amountHelper = { text: '', type: '' };
  if (amount !== '' && numericAmount > 0) {
    if (numericAmount > withdrawAccount.balance) {
      amountHelper = { text: `잔액(${won(withdrawAccount.balance)})을 초과했습니다`, type: 'err' };
    } else if (numericAmount < 1000) {
      amountHelper = { text: '최소 이체 금액은 1,000원입니다', type: 'err' };
    } else {
      amountHelper = { text: `${won(numericAmount)} 이체 가능합니다`, type: 'ok' };
    }
  }
  const isAmountValid = amountHelper.type === 'ok';

  function handleAccountNumberChange(e) {
    // 숫자 이외의 문자 제거
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
    setAccountNumber(digitsOnly);
  }

  function handleTestCodeClick(account) {
    setReceivingBank(account.bank);
    setAccountNumber(account.code);
  }

  function handleGoToStep2(e) {
    e.preventDefault();
    if (!isAccountVerified) return;
    setStep(2);
  }

  function handleBackToStep1() {
    setStep(1);
  }

  function handleAmountChange(e) {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
    setAmount(digitsOnly);
  }

  function handleQuickAmount(delta) {
    setAmount((prev) => String((Number(prev) || 0) + delta));
  }

  function handleClearAmount() {
    setAmount('');
  }

  function handleGoToStep3(e) {
    e.preventDefault();
    if (!isAmountValid) return;
    setStep(3);
  }

  function handleBackToStep2() {
    setStep(2);
  }

  function handleConfirmTransfer() {
    setStep(4);
  }

  function handleGoHome() {
    navigate('/');
  }

  return (
    <>
      {step === 1 && (
        <>
          <section className="page-title-section">
            <h2 className="page-title">누구에게 보낼까요?</h2>
            <p className="page-subtitle">출금 계좌와 받는 분의 계좌 정보를 입력해주세요</p>
          </section>

          <section className="quick-pick-section">
            <h3 className="quick-pick-title">내 계좌</h3>
            <ul className="quick-pick-list">
              <li>
                <button
                  type="button"
                  className="quick-pick-item"
                  onClick={() => handleTestCodeClick(MY_ACCOUNT)}
                >
                  <span className="quick-pick-avatar" style={{ backgroundColor: AVATAR_COLORS[0] }}>
                    {MY_ACCOUNT.owner[0]}
                  </span>
                  <span className="quick-pick-info">
                    <span className="quick-pick-name">{MY_ACCOUNT.owner}의 {BANK_LABELS[MY_ACCOUNT.bank]} 계좌</span>
                    <span className="quick-pick-account">{BANK_LABELS[MY_ACCOUNT.bank]} {MY_ACCOUNT.code}</span>
                  </span>
                </button>
              </li>
            </ul>
          </section>

          <section className="quick-pick-section">
            <h3 className="quick-pick-title">최근 이체</h3>
            <ul className="quick-pick-list">
              {RECENT_TRANSFERS.map((acc, i) => (
                <li key={acc.code}>
                  <button
                    type="button"
                    className="quick-pick-item"
                    onClick={() => handleTestCodeClick(acc)}
                  >
                    <span
                      className="quick-pick-avatar"
                      style={{ backgroundColor: AVATAR_COLORS[(i + 1) % AVATAR_COLORS.length] }}
                    >
                      {acc.owner[0]}
                    </span>
                    <span className="quick-pick-info">
                      <span className="quick-pick-name">{acc.owner}</span>
                      <span className="quick-pick-account">{BANK_LABELS[acc.bank]} {acc.code}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <form className="transfer-form" onSubmit={handleGoToStep2}>
            <div className="form-group">
              <label htmlFor="withdraw-account" className="input-label">출금 계좌</label>
              <div className="select-wrapper">
                <select
                  id="withdraw-account"
                  className="custom-select"
                  value={withdrawAccountId}
                  onChange={(e) => setWithdrawAccountId(e.target.value)}
                >
                  {WITHDRAW_ACCOUNTS.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.nickname} ({won(acc.balance)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="receiving-bank" className="input-label">받는 은행</label>
              <div className="select-wrapper">
                <select
                  id="receiving-bank"
                  className="custom-select"
                  value={receivingBank}
                  onChange={(e) => setReceivingBank(e.target.value)}
                >
                  <option value="woori">우리은행</option>
                  <option value="kb">국민은행</option>
                  <option value="shinhan">신한은행</option>
                  <option value="hana">하나은행</option>
                  <option value="kakao">카카오뱅크</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="account-number" className="input-label">계좌번호</label>
              <input
                type="text"
                id="account-number"
                className="custom-input"
                placeholder="- 없이 숫자만 입력 (예: 1002123456789)"
                inputMode="numeric"
                maxLength={16}
                value={accountNumber}
                onChange={handleAccountNumberChange}
              />
              {matchedAccount && (
                <div className="owner-chip">✓ 예금주 {matchedAccount.owner}님 확인됨</div>
              )}

              {hasInvalidAccount && (
                <p className="field-error">계좌번호를 다시 확인해주세요.</p>
              )}

              {!matchedAccount && !hasInvalidAccount && (
                <p className="test-account-info">
                  테스트용 등록 계좌:{' '}
                  {TEST_ACCOUNTS.map((acc, i) => (
                    <span key={acc.code}>
                      <code className="acc-code" onClick={() => handleTestCodeClick(acc)}>
                        {acc.code}
                      </code>{' '}
                      ({acc.owner}, {BANK_LABELS[acc.bank]}){i < TEST_ACCOUNTS.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              )}
            </div>

            <div className="btn-area">
              <button
                type="submit"
                className={`btn-next${isAccountVerified ? ' active' : ''}`}
                disabled={!isAccountVerified}
              >
                다음
              </button>
            </div>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <section className="page-title-section">
            <h2 className="page-title">얼마를 보낼까요?</h2>
            <p className="page-subtitle">
              {withdrawAccount.nickname} 잔액 {won(withdrawAccount.balance)} 중에서 보냅니다
            </p>
          </section>

          <form className="transfer-form" onSubmit={handleGoToStep3}>
            <div className="form-group">
              <input
                type="text"
                id="amount"
                className={`custom-input amount-input${amountHelper.type ? ` ${amountHelper.type}` : ''}`}
                placeholder="0"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
              />
              {amountHelper.text && (
                <p className={`amount-helper ${amountHelper.type}`}>{amountHelper.text}</p>
              )}
              <div className="amount-quick">
                <button type="button" onClick={() => handleQuickAmount(10000)}>+1만</button>
                <button type="button" onClick={() => handleQuickAmount(50000)}>+5만</button>
                <button type="button" onClick={() => handleQuickAmount(100000)}>+10만</button>
                <button type="button" onClick={handleClearAmount}>직접입력</button>
              </div>
            </div>

            <div className="btn-area">
              <button
                type="submit"
                className={`btn-next${isAmountValid ? ' active' : ''}`}
                disabled={!isAmountValid}
              >
                다음
              </button>
              <button type="button" className="btn-back" onClick={handleBackToStep1}>
                이전으로
              </button>
            </div>
          </form>
        </>
      )}

      {step === 3 && (
        <>
          <section className="page-title-section">
            <h2 className="page-title">이체 내용을 확인해주세요</h2>
          </section>

          <div className="confirm-card">
            <div className="confirm-row">
              <span className="confirm-key">받는 분</span>
              <span className="confirm-value">{BANK_LABELS[receivingBank]}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-key">계좌번호</span>
              <span className="confirm-value">{accountNumber}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-key">예금주</span>
              <span className="confirm-value">{matchedAccount.owner}</span>
            </div>
            <div className="confirm-row">
              <span className="confirm-key">출금 계좌</span>
              <span className="confirm-value">{withdrawAccount.nickname} ({withdrawAccount.accountNo})</span>
            </div>
            <div className="confirm-row confirm-total">
              <span className="confirm-key">이체 금액</span>
              <span className="confirm-value confirm-amount">{won(numericAmount)}</span>
            </div>
          </div>

          <div className="btn-area">
            <button type="button" className="btn-next active" onClick={handleConfirmTransfer}>
              이체하기
            </button>
            <button type="button" className="btn-back" onClick={handleBackToStep2}>
              이전으로
            </button>
          </div>
        </>
      )}

      {step === 4 && (
        <div className="success-wrap">
          <div className="success-icon">✓</div>
          <h2 className="success-title">이체가 완료되었습니다</h2>
          <p className="success-desc">
            {withdrawAccount.nickname}에서 {matchedAccount.owner}님께 {won(numericAmount)}을 보냈습니다
          </p>
          <div className="btn-area">
            <button type="button" className="btn-next active" onClick={handleGoHome}>
              홈으로
            </button>
          </div>
        </div>
      )}
    </>
  );
}
