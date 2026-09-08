import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAccounts } from '../../api/bankingApi'

const AccountSection = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    let cancelled = false
    getAccounts().then((data) => {
      if (!cancelled) setAccounts(data)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      className="accounts"
      aria-labelledby="accounts-title"
    >
      <div className="accounts-header">
        <h2 id="accounts-title">내 계좌</h2>

        <button
          type="button"
          className="view-all-button"
          onClick={() => navigate("/history")}
        >
          전체보기
        </button>
      </div>

      <ul className="account-list">
        {accounts.map((account) => (
          <li key={account.id}>
            <article className="account-card">
              <div className="account-info">
                <h3>{account.nickname}</h3>

                <p className="account-number">
                  {account.accountNo}
                </p>
              </div>

              <div className="account-balance">
                <p className="account-balance-value">
                  {account.balance.toLocaleString()}원
                </p>

                <p className="account-type">
                  {account.type}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default AccountSection
