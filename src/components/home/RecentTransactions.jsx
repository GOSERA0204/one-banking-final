import { useEffect, useState } from "react";
import { getAccounts, getTransactions } from "../../api/bankingApi";
import TransactionDetail from "./TransactionDetail";
import { useNavigate } from "react-router-dom";

const RECENT_COUNT = 4;

// "2026-08-23" 또는 "2026.08.23" 형식 모두 "08-23"로 표시합니다.
function formatShortDate(dateStr) {
  const parts = dateStr.split(/[-.]/);
  if (parts.length < 3) return dateStr;
  return `${parts[1]}-${parts[2]}`;
}

const RecentTransactions = () => {
  // 어떤 거래를 클릭했는지 저장하는 공간
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const navigate = useNavigate();

  // 홈 화면에 다시 들어올 때마다 최신 계좌/거래내역을 새로 불러옵니다.
  useEffect(() => {
    let cancelled = false;
    Promise.all([getAccounts(), getTransactions("ALL", "ALL")]).then(([accData, txData]) => {
      if (cancelled) return;
      setAccounts(accData);
      setTransactions(txData.slice(0, RECENT_COUNT));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const accountsById = Object.fromEntries(accounts.map((acc) => [acc.id, acc]));

  const displayTransactions = transactions.map((tx) => {
    const account = accountsById[tx.accountId];
    const accountLabel = account
      ? `${account.nickname} (${account.accountNo})`
      : tx.accountNickname ?? "";

    return {
      id: tx.id,
      title: tx.desc,
      account: accountLabel,
      date: formatShortDate(tx.date),
      fullDate: `${tx.date} ${tx.time}`,
      amount: `${tx.type === "in" ? "+" : "-"}${Number(tx.amount).toLocaleString()}원`,
      balance: `${Number(tx.balanceAfter).toLocaleString()}원`,
      type: tx.type === "in" ? "income" : "expense",
    };
  });

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

        {displayTransactions.map((transaction) => (

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
