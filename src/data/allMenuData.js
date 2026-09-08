// AllMenuPage(전체 메뉴)가 사용하는 더미 데이터입니다.

export const CURRENT_USER_NAME = '김민준'

export const QUICK_ICONS = [
  { key: 'my-account', label: '내 계좌', icon: 'mdi/wallet-outline' },
  { key: 'my-card', label: '내 카드', icon: 'mdi/credit-card-outline' },
  { key: 'mobile-id', label: '모바일신분증', icon: 'mdi/card-account-details-outline' },
  { key: 'notice', label: '공지사항', icon: 'mdi/bullhorn-outline' },
  { key: 'support', label: '고객센터', icon: 'mdi/headset' }
];

export const POPULAR_ITEMS = [
  { key: 'won-plus-deposit', title: 'WON 플러스 예금', desc: '우대금리 최대 연 3.5%' },
  { key: 'worker-loan', title: '우리 WON하는 직장인 대출 비교하기', desc: '내게 맞는 금리 한눈에' },
  { key: 'won-card', title: 'WON 카드의 정석 체크/신용카드', desc: '연회비 0원, 캐시백 혜택' },
  { key: 'youth-leap', title: '청년도약계좌 / 미래 자산 관리 알아보기', desc: '정부 기여금 + 비과세 혜택' }
];

export const RECENT_ITEMS = [
  { key: 'cma-note', title: '우리WON CMA Note', desc: '최근 조회한 상품' },
  { key: 'youth-future-savings', title: '청년미래적금', desc: '최근 가입한 상품' }
];

export const CATEGORY_TABS = ['서비스', 'AI', '통장', '저축', '카드', '대출', '외환', '금융상품'];

export const CATEGORY_MENUS = {
  서비스: [
    {
      title: '이체·출금',
      items: [
        { label: '이체', to: '/transfer' },
        { label: 'AI 이체' },
        { label: '예약이체' },
        { label: '자동이체 관리' },
        { label: '출금' }
      ]
    },
    {
      title: '조회',
      items: [
        { label: '계좌조회' },
        { label: '거래내역조회', to: '/history' },
        { label: '잔액조회' }
      ]
    },
    {
      title: '인증/보안',
      items: [{ label: '인증서' }, { label: '보안센터' }, { label: 'OTP발급' }]
    }
  ],
  AI: [
    {
      title: 'AI 금융비서',
      items: [{ label: 'AI 상담' }, { label: 'AI 이체' }, { label: 'AI 자산관리 추천' }]
    },
    {
      title: 'AI 리포트',
      items: [{ label: '소비패턴 분석' }, { label: '맞춤 상품 추천' }]
    }
  ],
  통장: [
    {
      title: '입출금통장',
      items: [{ label: '통장 개설' }, { label: '통장 조회' }, { label: '통장 해지' }]
    },
    {
      title: '모임통장',
      items: [{ label: '모임통장 만들기' }, { label: '모임통장 관리' }]
    }
  ],
  저축: [
    {
      title: '적금',
      items: [{ label: '적금 가입' }, { label: '자유적립적금' }, { label: '정기적금' }]
    },
    {
      title: '예금',
      items: [{ label: '정기예금' }, { label: 'WON 플러스 예금' }]
    },
    {
      title: '청년상품',
      items: [{ label: '청년도약계좌' }, { label: '청년희망적금' }]
    }
  ],
  카드: [
    {
      title: '체크카드',
      items: [{ label: '체크카드 신청' }, { label: '카드 조회' }]
    },
    {
      title: '신용카드',
      items: [{ label: '신용카드 신청' }, { label: '카드 한도조회' }]
    },
    {
      title: '카드관리',
      items: [{ label: '분실신고' }, { label: '카드 재발급' }]
    }
  ],
  대출: [
    {
      title: '신용대출',
      items: [{ label: '마이너스통장' }, { label: '직장인대출' }]
    },
    {
      title: '담보대출',
      items: [{ label: '주택담보대출' }, { label: '전세자금대출' }]
    },
    {
      title: '대출조회',
      items: [{ label: '대출 한도조회' }, { label: '대출 상환' }]
    }
  ],
  외환: [
    {
      title: '환전',
      items: [{ label: '환율조회' }, { label: '외화환전' }]
    },
    {
      title: '해외송금',
      items: [{ label: '해외송금 신청' }, { label: '송금조회' }]
    },
    {
      title: '외화예금',
      items: [{ label: '외화정기예금' }, { label: '외화보통예금' }]
    }
  ],
  금융상품: [
    {
      title: '상품몰',
      items: [{ label: '예적금 상품' }, { label: '펀드 상품' }, { label: '보험 상품' }, { label: '대출 상품' }]
    }
  ]
};
