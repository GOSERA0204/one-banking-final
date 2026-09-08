import { useEffect, useState } from "react";
import { getTransactions } from "../../api/bankingApi";

export default function NotificationModal({ isOpen, onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);

    // 전체 거래 내역 조회
    getTransactions("ALL", "ALL")
      .then((data) => {
        if (!cancelled) {
          setTransactions(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="transaction-overlay" onClick={onClose} />
      <div className="transaction-detail notification-sheet">
        <div className="detail-handle" />

        <div className="detail-title">
          <h2>🔔 입출금 알림 내역</h2>
          <span style={{ fontSize: "13px", color: "#767676" }}>
            최근 발생한 전체 금융 거래 알림입니다.
          </span>
        </div>

        <div className="notification-list" style={{ maxHeight: "380px", overflowY: "auto" }}>
          {loading ? (
            <p style={{ textAlign: "center", color: "#767676", padding: "20px" }}>내역 불러오는 중...</p>
          ) : transactions.length === 0 ? (
            <p style={{ textAlign: "center", color: "#767676", padding: "20px" }}>알림 내역이 없습니다.</p>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="transaction-item" style={{ cursor: "default" }}>
                <div className="transaction-info">
                  <strong>{tx.desc}</strong>
                  <span>{tx.date} {tx.time}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={`transaction-amount ${tx.type === "in" ? "income" : "expense"}`}>
                    {tx.type === "in" ? "+" : "-"}{Number(tx.amount).toLocaleString()}원
                  </span>
                  <div style={{ fontSize: "11px", color: "#767676", marginTop: "2px" }}>
                    잔액 {Number(tx.balanceAfter).toLocaleString()}원
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button className="detail-close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </>
  );
}