const accounts = [
  {
    id: 1,
    name: '우리 첫급여통장',
    number: '1002-***-123456',
    balance: '2,384,560',
    type: '입출금',
  },
  {
    id: 2,
    name: '우리 SUPER주거래통장',
    number: '1002-***-789012',
    balance: '15,200,000',
    type: '저축예금',
  },
  {
    id: 3,
    name: '우리 청년도약계좌',
    number: '1002-***-456789',
    balance: '5,000,000',
    type: '적금',
  },
]

const AccountSection = () => {
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
        >
          전체보기
        </button>
      </div>

      <ul className="account-list">
        {accounts.map((account) => (
          <li key={account.id}>
            <article className="account-card">
              <div className="account-info">
                <h3>{account.name}</h3>

                <p className="account-number">
                  {account.number}
                </p>
              </div>

              <div className="account-balance">
                <p className="account-balance-value">
                  {account.balance}원
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