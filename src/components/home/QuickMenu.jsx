import { Link } from 'react-router-dom'

const QuickMenu = () => {
  return (
    <nav className="quick-menu" aria-label="퀵 메뉴">
      <ul>
        <li>
          <Link to="/transfer">
            <span className="quick-icon">
              <img
                src="https://api.iconify.design/mdi/bank-transfer.svg"
                alt=""
              />
            </span>
            <span>이체</span>
          </Link>
        </li>

        <li>
          <Link to="/history">
            <span className="quick-icon">
              <img
                src="https://api.iconify.design/mdi/clipboard-text-clock-outline.svg"
                alt=""
              />
            </span>
            <span>거래내역</span>
          </Link>
        </li>

        <li>
          <button type="button">
            <span className="quick-icon">
              <img
                src="https://api.iconify.design/mdi/package-variant-closed.svg"
                alt=""
              />
            </span>
            <span>상품</span>
          </button>
        </li>

        <li>
          <button type="button">
            <span className="quick-icon">
              <img
                src="https://api.iconify.design/mdi/chart-bar.svg"
                alt=""
              />
            </span>
            <span>자산관리</span>
          </button>
        </li>

        <li>
          <button type="button">
            <span className="quick-icon">
              <img
                src="https://api.iconify.design/mdi/dots-horizontal.svg"
                alt=""
              />
            </span>
            <span>전체</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default QuickMenu