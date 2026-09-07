import { useState } from "react";
import TransactionDetail from "./TransactionDetail";
import { useNavigate } from "react-router-dom";

const RecentTransactions = () => {
  // 어떤 거래를 클릭했는지 저장하는 공간
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const navigate = useNavigate();

  // 최근 거래 데이터
  const transactions = [
    {
      id: 1,
      title: "스타벅스 강남점",
      account: "우리 청년통장 (1002-***-123456)",
      date: "08-23",
      fullDate: "2026-08-23 09:12",
      amount: "-5,800원",
      balance: "2,384,560원",
      type: "expense",
    },
    {
      id: 2,
      title: "월급",
      account: "우리 청년통장 (1002-***-123456)",
      date: "08-22",
      fullDate: "2026-08-22 09:00",
      amount: "+3,200,000원",
      balance: "3,205,600원",
      type: "income",
    },
    {
      id: 3,
      title: "이선",
      account: "우리 청년통장 (1002-***-123456)",
      date: "08-22",
      fullDate: "2026-08-22 14:30",
      amount: "-30,000원",
      balance: "3,175,600원",
      type: "expense",
    },
    {
      id: 4,
      title: "자동이체 · 적금",
      account: "우리 SUPER주거래통장",
      date: "08-21",
      fullDate: "2026-08-21 10:00",
      amount: "-500,000원",
      balance: "15,200,000원",
      type: "expense",
    },
  ];

  return (
    <section className="recent-transactions">

      <div className="section-header">
        <h2>최근 거래</h2>

        <button className="view-all-btn"
        onClick={() => navigate("/history")}>
          전체보기
        </button>
      </div>

      <div className="transaction-list">

        {transactions.map((transaction) => (

          <button
            className="transaction-item"
            key={transaction.id}

            // 거래 클릭하면 선택된 거래로 저장
            onClick={() => setSelectedTransaction(transaction)}
          >

            <div className="transaction-info">
              <strong>{transaction.title}</strong>

              <span>
                {transaction.account.split(" (")[0]} · {transaction.date}
              </span>
            </div>

            <span
              className={
                transaction.type === "income"
                  ? "transaction-amount income"
                  : "transaction-amount expense"
              }
            >
              {transaction.amount}
            </span>

          </button>

        ))}

      </div>

      {/* 거래를 클릭했을 때만 상세창 표시 */}
      {selectedTransaction && (
        <TransactionDetail
          transaction={selectedTransaction}

          // 닫기 버튼을 누르면 선택된 거래를 없앰
          onClose={() => setSelectedTransaction(null)}
        />
      )}

    </section>
  );
};

export default RecentTransactions;