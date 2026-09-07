const TransactionDetail = ({ transaction, onClose }) => {
  // transaction이 없으면 아무것도 보여주지 않음
  if (!transaction) {
    return null;
  }

  return (
    <>
      {/* 뒤쪽 어둡게 만드는 배경 */}
      <div className="transaction-overlay" onClick={onClose}></div>

      {/* 아래에서 올라오는 상세 창 */}
      <div className="transaction-detail">
        
        {/* 위쪽 손잡이 */}
        <div className="detail-handle"></div>

        {/* 거래 이름 */}
        <div className="detail-title">
          <h2>{transaction.title}</h2>
          <strong>{transaction.amount}</strong>
        </div>

        {/* 상세 정보 */}
        <div className="detail-info">

          <div className="detail-row">
            <span>거래일시</span>
            <strong>{transaction.fullDate}</strong>
          </div>

          <div className="detail-row">
            <span>거래계좌</span>
            <strong>{transaction.account}</strong>
          </div>

          <div className="detail-row">
            <span>거래 후 잔액</span>
            <strong>{transaction.balance}</strong>
          </div>

          <div className="detail-row">
            <span>상태</span>
            <strong>완료</strong>
          </div>

        </div>

        {/* 닫기 버튼 */}
        <button
          className="detail-close-btn"
          onClick={onClose}
        >
          닫기
        </button>

      </div>
    </>
  );
};

export default TransactionDetail;