/**
 * ====================================================================
 * HistoryPage.jsx - 고도화된 거래내역 페이지 컴포넌트
 * 
 * 💡 핵심 기능:
 * 1. 계좌 선택 가로 스크롤 칩 (마우스 휠 좌우 스크롤 & 마우스 드래그 지원)
 * 2. 전체 / 입금 / 출금 세그먼트 필터 버튼
 * 3. 날짜별 그룹 카드 분할 (예: 2026-08-23 뱃지 아래 해당일 거래 묶음)
 * 4. 입금(파랑 ↓), 출금(빨강/어두운색 ↑) 원형 아이콘 및 통장 잔액 표시
 * 5. bankingApi.js와 연동되어 백엔드 서버가 꺼져도 더미 데이터로 매끄럽게 작동
 * ====================================================================
 */
import React, { useRef, useState, useEffect } from "react";
import { getAccounts, getTransactions } from "../api/bankingApi";
import "../styles/history.css";

export default function HistoryPage() {
  // [1. 상태(State) 관리]
  const [accounts, setAccounts] = useState([]);               // 계좌 목록
  const [transactions, setTransactions] = useState([]);       // 거래내역 목록
  const [selectedAccId, setSelectedAccId] = useState("ALL");  // 선택된 계좌 ("ALL" 또는 "acc-1")
  const [selectedType, setSelectedType] = useState("ALL");    // 거래 구분 ("ALL", "in", "out")
  const [isLoading, setIsLoading] = useState(true);

  // [2. 마우스 드래그 & 휠 스크롤 전용 Ref 및 상태]
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // [3. 초기 데이터 로드 (계좌 목록 & 초기 거래내역)]
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      try {
        const [accData, txData] = await Promise.all([
          getAccounts(),
          getTransactions("ALL", "ALL"),
        ]);
        setAccounts(accData);
        setTransactions(txData);
      } catch (error) {
        console.error("데이터 로드 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, []);

  // [4. 계좌 선택 또는 입/출금 필터 변경 시 거래내역 재조회]
  useEffect(() => {
    const fetchFiltered = async () => {
      const data = await getTransactions(selectedAccId, selectedType);
      setTransactions(data);
    };
    fetchFiltered();
  }, [selectedAccId, selectedType]);

  // [5. 마우스 휠 이벤트 -> 가로 스크롤로 변환]
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      // 세로 휠 굴림 발생 시 브라우저 기본 세로 스크롤을 막고 가로로 이동시킵니다.
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollBy({
          left: e.deltaY * 0.9,
          behavior: "smooth",
        });
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // [6. PC 마우스 클릭 & 드래그 스크롤 제어]
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // 드래그 가속도
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // [7. 날짜별 거래내역 그룹화 (Object.reduce 활용)]
  const groupedTransactions = transactions.reduce((acc, tx) => {
    const dateKey = tx.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(tx);
    return acc;
  }, {});

  return (
    <main className="history-page">
      {/* ── 타이틀 섹션 ── */}
      <section className="history-title-area">
        <h2 className="title-text">거래내역</h2>
        <span className="tx-counter">총 {transactions.length}건</span>
      </section>

      {/* ── 1. 계좌 선택 가로 스크롤 칩 (마우스 휠 & 드래그) ── */}
      <div
        className={`account-tabs-wrapper ${isDragging ? "dragging" : ""}`}
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="account-tabs">
          <button
            type="button"
            className={`chip-btn ${selectedAccId === "ALL" ? "active" : ""}`}
            onClick={() => setSelectedAccId("ALL")}
          >
            전체계좌
          </button>
          {accounts.map((acc) => (
            <button
              key={acc.id}
              type="button"
              className={`chip-btn ${selectedAccId === acc.id ? "active" : ""}`}
              onClick={() => setSelectedAccId(acc.id)}
            >
              {acc.nickname}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. 거래 구분 필터 버튼 (전체 / 입금 / 출금) ── */}
      <div className="type-filter-group">
        <button
          type="button"
          className={`type-filter-btn ${selectedType === "ALL" ? "active" : ""}`}
          onClick={() => setSelectedType("ALL")}
        >
          전체
        </button>
        <button
          type="button"
          className={`type-filter-btn ${selectedType === "in" ? "active" : ""}`}
          onClick={() => setSelectedType("in")}
        >
          입금
        </button>
        <button
          type="button"
          className={`type-filter-btn ${selectedType === "out" ? "active" : ""}`}
          onClick={() => setSelectedType("out")}
        >
          출금
        </button>
      </div>

      {/* ── 3. 거래내역 리스트 영역 (날짜별 그룹 카드) ── */}
      <section className="history-list-section">
        {isLoading ? (
          <div className="empty-card">거래내역을 불러오는 중입니다...</div>
        ) : Object.keys(groupedTransactions).length === 0 ? (
          <div className="empty-card">
            <span className="empty-icon">📂</span>
            <p>선택하신 조건에 해당하는 거래내역이 없습니다.</p>
          </div>
        ) : (
          Object.keys(groupedTransactions).map((date) => (
            <div key={date} className="date-group">
              {/* 날짜 뱃지 */}
              <div className="date-badge">{date}</div>

              {/* 해당 날짜의 거래 카드 박스 */}
              <div className="tx-box">
                {groupedTransactions[date].map((tx) => {
                  const isOut = tx.type === "out";
                  return (
                    <div key={tx.id} className="tx-item">
                      {/* 좌측: 원형 아이콘 + 상호명 + 시각 */}
                      <div className="tx-item-left">
                        <div className={`tx-icon-circle ${isOut ? "out" : "in"}`}>
                          {isOut ? "↑" : "↓"}
                        </div>
                        <div className="tx-info-text">
                          <div className="tx-target">{tx.desc}</div>
                          <div className="tx-time">
                            {tx.time} · {tx.accountNickname}
                          </div>
                        </div>
                      </div>

                      {/* 우측: 금액 + 잔액 */}
                      <div className="tx-item-right">
                        <div className={`tx-value ${isOut ? "out" : "in"}`}>
                          {isOut ? "-" : "+"}
                          {Number(tx.amount).toLocaleString()}원
                        </div>
                        <div className="tx-after-balance">
                          잔액 {Number(tx.balanceAfter).toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}