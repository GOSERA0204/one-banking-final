import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAccounts, postTransfer } from '../api/bankingApi';
import {
  AVATAR_COLORS,
  BANK_LABELS,
  MY_ACCOUNT,
  RECENT_TRANSFERS,
  TEST_ACCOUNTS,
  won
} from '../data/transferAccounts';
import '../styles/transfer.css';

export default function TransferPage() {
  const navigate = useNavigate();
  const { state } = useLocation();


  const [step, setStep] = useState(1);
  const [accounts, setAccounts] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [withdrawAccountId, setWithdrawAccountId] = useState('');
  const [receivingBank, setReceivingBank] = useState(state?.receivingBank ?? 'woori');
  const [accountNumber, setAccountNumber] = useState(state?.accountNumber ?? '');
  const [amount, setAmount] = useState('');
  const [recipientQuery, setRecipientQuery] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferError, setTransferError] = useState('');

  
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getAccounts();
      if (cancelled) return;
      setAccounts(data);
      setWithdrawAccountId(data[0]?.id ?? '');
      setIsLoadingAccounts(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const withdrawAccount = accounts.find((acc) => acc.id === withdrawAccountId);

  const query = recipientQuery.trim();
  const matchesQuery = (acc) => query === '' || acc.owner.includes(query) || acc.code.includes(query);
  const showMyAccount = matchesQuery(MY_ACCOUNT);
  const filteredRecentTransfers = RECENT_TRANSFERS.filter(matchesQuery);

  const accountByNumber = TEST_ACCOUNTS.find((acc) => acc.code === accountNumber);
  const matchedAccount = accountByNumber && accountByNumber.bank === receivingBank ? accountByNumber : null;
  const hasInvalidAccount = accountNumber.length >= 10 && !matchedAccount;
  const isAccountVerified = Boolean(matchedAccount);

  const numericAmount = Number(amount);
  let amountHelper = { text: '', type: '' };
  if (amount !== '' && numericAmount > 0 && withdrawAccount) {
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

  async function handleConfirmTransfer() {
    setTransferError('');
    setIsTransferring(true);
    try {
      await postTransfer({
        fromAccountId: withdrawAccountId,
        toBank: receivingBank,
        toAccountNo: accountNumber,
        toOwnerName: matchedAccount.owner,
        amount: numericAmount,
      });
      setStep(4);
    } catch (err) {
      setTransferError(err.message || '이체 처리 중 오류가 발생했습니다.');
    } finally {
      setIsTransferring(false);
    }
  }

  function handleGoHome() {
    navigate('/');
  }

  if (isLoadingAccounts) {
    return (
      <section className="page-title-section">
        <h2 className="page-title">계좌 정보를 불러오는 중입니다...</h2>
      </section>
    );
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
                  {accounts.map((acc) => (
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

          {transferError && <p className="field-error">{transferError}</p>}

          <div className="btn-area">
            <button
              type="button"
              className="btn-next active"
              onClick={handleConfirmTransfer}
              disabled={isTransferring}
            >
              {isTransferring ? '처리 중...' : '이체하기'}
            </button>
            <button type="button" className="btn-back" onClick={handleBackToStep2} disabled={isTransferring}>
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
