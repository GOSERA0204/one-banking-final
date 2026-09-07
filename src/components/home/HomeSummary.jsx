import { useState } from 'react'

const HomeSummary = () => {
  const [isHidden, setIsHidden] = useState(false)

  const totalAsset = '22,584,560'

  return (
    <>
      <section className="greeting">
        <p className="greeting-hello">
          안녕하세요 <span>👋</span>
        </p>

        <h1 className="greeting-name">
          김민준님
        </h1>
      </section>

      <section className="asset-card">
        <div className="asset-card-top">
          <span className="asset-label">총 자산</span>

          <button
            type="button"
            className="hide-button"
            onClick={() => setIsHidden(!isHidden)}
          >
            {isHidden ? '보기' : '숨기기'}
          </button>
        </div>

        <p className="asset-amount">
          {isHidden ? '••••••••' : totalAsset}
          {!isHidden && <span className="asset-unit">원</span>}
        </p>

        <p className="asset-desc">
          계좌 3개 합산 금액입니다
        </p>
      </section>
    </>
  )
}

export default HomeSummary