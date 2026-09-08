import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CATEGORY_MENUS,
  CATEGORY_TABS,
  CURRENT_USER_NAME,
  POPULAR_ITEMS,
  QUICK_ICONS,
  RECENT_ITEMS
} from '../data/allMenuData';
import '../styles/allmenu.css';

function IconImg({ name, alt = '' }) {
  return <img src={`https://api.iconify.design/${name}.svg`} alt={alt} />;
}

function MenuEntry({ item }) {
  const content = <span className="menu-entry-label">{item.label}</span>;
  if (item.to) {
    return (
      <Link to={item.to} className="menu-entry">
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className="menu-entry">
      {content}
    </button>
  );
}

export default function AllMenuPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORY_TABS[0]);
  const [productTab, setProductTab] = useState('popular');

  const productList = productTab === 'popular' ? POPULAR_ITEMS : RECENT_ITEMS;
  const menuGroups = CATEGORY_MENUS[activeCategory] ?? [];

  return (
    <div className="all-menu-page">
      {/* 1. 헤더 영역 */}
      <section className="all-menu-header">
        <button type="button" className="user-row">
          <span className="user-name">{CURRENT_USER_NAME}</span>
          <span className="user-chevron" aria-hidden="true">›</span>
        </button>

        <div className="header-actions-row">
          <button type="button" className="round-icon-btn" aria-label="검색">
            <IconImg name="mdi/magnify" />
          </button>
          <button type="button" className="round-icon-btn" aria-label="설정">
            <IconImg name="mdi/cog-outline" />
          </button>
          <button type="button" className="ai-consult-btn">
            <IconImg name="mdi/robot-happy-outline" />
            <span>AI 상담</span>
          </button>
        </div>
      </section>

      {/* 퀵 뱅킹 아이콘 메뉴 */}
      <section className="quick-icon-row" aria-label="퀵 뱅킹 메뉴">
        {QUICK_ICONS.map((item) => (
          <button key={item.key} type="button" className="quick-icon-item">
            <span className="quick-icon-circle">
              <IconImg name={item.icon} />
            </span>
            <span className="quick-icon-label">{item.label}</span>
          </button>
        ))}
      </section>

      {/* 2. 최근/인기 상품 영역 */}
      <section className="product-section">
        <div className="product-tabs">
          <button
            type="button"
            className={`product-tab${productTab === 'popular' ? ' active' : ''}`}
            onClick={() => setProductTab('popular')}
          >
            인기
          </button>
          <button
            type="button"
            className={`product-tab${productTab === 'recent' ? ' active' : ''}`}
            onClick={() => setProductTab('recent')}
          >
            최근
          </button>
        </div>

        <ul className="product-card-list">
          {productList.map((item) => (
            <li key={item.key} className="product-card">
              <p className="product-card-title">{item.title}</p>
              <p className="product-card-desc">{item.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. 카테고리별 서비스 탭 & 상세 메뉴 */}
      <section className="category-section">
        <div className="category-tabs-wrapper">
          <div className="category-tabs">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-tab${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="category-menu-panel">
          {menuGroups.map((group) => (
            <div key={group.title} className="menu-group">
              <h3 className="menu-group-title">{group.title}</h3>
              <div className="menu-group-items">
                {group.items.map((item) => (
                  <MenuEntry key={item.label} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
