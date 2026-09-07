import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AVATAR_COLORS,
  BANK_LABELS,
  MY_ACCOUNT,
  RECENT_TRANSFERS,
  TEST_ACCOUNTS,
  WITHDRAW_ACCOUNTS,
  won
} from '../data/transferAccounts';
import '../styles/transfer.css';

export default function TransferPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [step, setStep] = useState(1);
  const [withdrawAccountId, setWithdrawAccountId] = useState(WITHDRAW_ACCOUNTS[0].id);
  const [receivingBank, setReceivingBank] = useState('woori');
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [recipientQuery, setRecipientQuery] = useState('');

  // 계좌번호 직접입력 페이지에서 "확인"을 누르고 돌아오면, 그 결과를 반영합니다.
  useEffect(() => {
    if (state?.receivingBank && state?.accountNumber) {
      setReceivingBank(state.receivingBank);
      setAccountNumber(state.accountNumber);
    }
  }, [state]);

  const withdrawAccount = WITHDRAW_ACCOUNTS.find((acc) => acc.id === withdrawAccountId);

  // 이름 또는 계좌번호로 "내 계좌"/"최근 이체" 목록을 검색합니다.
  const query = recipientQuery.trim();
  const matchesQuery = (acc) => query === '' || acc.owner.includes(query) || acc.code.includes(query);
  const showMyAccount = matchesQuery(MY_ACCOUNT);
  const filteredRecentTransfers = RECENT_TRANSFERS.filter(matchesQuery);

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

  function handleTestCodeClick(account) {
    setReceivingBank(account.bank);
    setAccountNumber(account.code);
  }

  function handleOpenManualEntry() {
    navigate('/transfer/manual', { state: { receivingBank, accountNumber } });
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

          <form className="transfer-form" onSubmit={handleGoToStep2}>
            <div className="recipient-search">
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="받는사람 이름 또는 계좌번호"
                value={recipientQuery}
                onChange={(e) => setRecipientQuery(e.target.value)}
              />
              <button type="button" className="manual-entry-btn" onClick={handleOpenManualEntry}>
                + 계좌번호 직접입력
              </button>
            </div>

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

            {showMyAccount && (
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
            )}

            {filteredRecentTransfers.length > 0 && (
              <section className="quick-pick-section">
                <h3 className="quick-pick-title">최근 이체</h3>
                <ul className="quick-pick-list">
                  {filteredRecentTransfers.map((acc, i) => (
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
            )}

            {accountNumber !== '' && (
              <section className="recipient-summary">
                <div className="recipient-summary-row">
                  <div>
                    <p className="recipient-summary-bank">{BANK_LABELS[receivingBank]} {accountNumber}</p>
                    {matchedAccount && (
                      <p className="recipient-summary-owner">✓ {matchedAccount.owner}님 확인됨</p>
                    )}
                    {hasInvalidAccount && (
                      <p className="field-error">계좌번호를 다시 확인해주세요.</p>
                    )}
                  </div>
                  <button type="button" className="recipient-summary-edit" onClick={handleOpenManualEntry}>
                    수정
                  </button>
                </div>
              </section>
            )}

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
