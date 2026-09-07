import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BANK_LABELS, TEST_ACCOUNTS } from '../data/transferAccounts';
import '../styles/transfer.css';

export default function TransferManualEntryPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [receivingBank, setReceivingBank] = useState(state?.receivingBank ?? 'woori');
  const [accountNumber, setAccountNumber] = useState(state?.accountNumber ?? '');

  const accountByNumber = TEST_ACCOUNTS.find((acc) => acc.code === accountNumber);
  const matchedAccount = accountByNumber && accountByNumber.bank === receivingBank ? accountByNumber : null;
  const hasInvalidAccount = accountNumber.length >= 10 && !matchedAccount;
  const isAccountVerified = Boolean(matchedAccount);

  function handleAccountNumberChange(e) {
    const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
    setAccountNumber(digitsOnly);
  }

  function handleTestCodeClick(account) {
    setReceivingBank(account.bank);
    setAccountNumber(account.code);
  }

  function handleConfirm(e) {
    e.preventDefault();
    if (!isAccountVerified) return;
    navigate('/transfer', { state: { receivingBank, accountNumber } });
  }

  function handleCancel() {
    navigate('/transfer');
  }

  return (
    <>
      <section className="page-title-section">
        <h2 className="page-title">계좌번호로 보내기</h2>
        <p className="page-subtitle">받는 분의 은행과 계좌번호를 입력해주세요</p>
      </section>

      <form className="transfer-form" onSubmit={handleConfirm}>
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
            autoFocus
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
            확인
          </button>
          <button type="button" className="btn-back" onClick={handleCancel}>
            취소
          </button>
        </div>
      </form>
    </>
  );
}
