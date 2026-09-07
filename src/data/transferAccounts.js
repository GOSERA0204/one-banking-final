// 이체 페이지(TransferPage, TransferManualEntryPage)가 함께 쓰는 더미 데이터입니다.

export const BANK_LABELS = {
  woori: '우리은행',
  kb: '국민은행',
  shinhan: '신한은행',
  hana: '하나은행',
  kakao: '카카오뱅크'
};

export const TEST_ACCOUNTS = [
  { code: '1002123456789', owner: '김민준', bank: 'woori' },
  { code: '1002987654321', owner: '이서연', bank: 'woori' },
  { code: '1102555666777', owner: '박지훈', bank: 'kb' }
];

// 현재 로그인한 사용자(김민준님) 소유 계좌 — "내 계좌"로 바로 골라 보낼 수 있게 합니다.
export const MY_ACCOUNT = TEST_ACCOUNTS[0];
// 최근에 이체한 적 있는 상대 계좌 목록
export const RECENT_TRANSFERS = TEST_ACCOUNTS.slice(1);
export const AVATAR_COLORS = ['#0066cc', '#8b5e34', '#14875a', '#c07a17'];

export const WITHDRAW_ACCOUNTS = [
  { id: 'woori-1', nickname: '우리 첫급여통장', accountNo: '1002-***-123456', balance: 2384560 },
  { id: 'woori-2', nickname: '우리 SUPER주거래통장', accountNo: '1002-***-789012', balance: 15200000 },
  { id: 'woori-3', nickname: '우리 청년도약계좌', accountNo: '1002-***-456789', balance: 5000000 }
];

export function won(amount) {
  return `${amount.toLocaleString()}원`;
}
