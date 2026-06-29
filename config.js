window.APP_CONFIG = {
  HB_KEYWORDS: ["올리브영", "다이소", "롭스", "왓슨스", "부츠"],
  WAREHOUSE_PHARMACY_NAMES: [],
  WEIGHTS: { demand: 25, traffic: 20, competition: 20, economics: 20, physical: 15 },
  BENCHMARK_RENT_PER_PY: 9.0,
  FRANCHISE_ECONOMICS: {
    REF_AREA_PY: 180,
    MIN_AREA_PY: 100,
    IDEAL_AREA_MIN: 150,
    IDEAL_AREA_MAX: 220,
    MONTHLY_SETTLED_SALES: 17531,
    MONTHLY_GROSS_PLUS_SUBLEASE: 7952,
    MONTHLY_OP_PROFIT_REF: 5490,
    MAINTENANCE_PER_PY: 2.4,
    LABOR_BASE: 1380,
    OTHER_OPEX: 300,
    TRADEMARK_RATE: 0.02,
    GROSS_CONTRIB_RATIO: 0.4536,
    SCENARIO: "conservative",
    NORMAL_SCENARIO_UPLIFT: 1.18,
    CONSERVATIVE_SALES_FACTOR: 0.88,
    MIN_RENT_COMPARE_PY: 7
  },
  ACCESS_CODE: "",
  KAKAO_JS_KEY: "",
  TRADE_RADIUS_KM: 2,
  ROAD_HOUSEHOLD_BENCHMARK: 8000,
  RENT_SALE_RATIO: {
    "지식산업센터": 320,
    "아파트 단지내 상가": 260,
    "복합상가": 200,
    "근린상가": 240
  },
  SCORING: {
    GRADES: [
      { min: 90, grade: "S", verdict: "최우선 검토 입지 — 핵심 지표 우수" },
      { min: 80, grade: "A", verdict: "적합 — 출점 검토 권장 (임대·현장 확인 전제)" },
      { min: 68, grade: "B", verdict: "조건부 적합 — 협상·보완 후 재평가 권장" },
      { min: 50, grade: "C", verdict: "신중 검토 — 주요 리스크 해소 필요" },
      { min: 0, grade: "D", verdict: "부적합 — 출점 비권장" }
    ],
    DEMAND: {
      ROAD_HOUSEHOLD_FULL: 8000,
      REGION_HOUSEHOLD_FULL: 120000,
      AGE_TARGET_RATIO: 48,
      APT_COMPLEX_FULL: 40
    },
    TRAFFIC: {
      SUBWAY_IDEAL_M: 400,
      SUBWAY_GOOD_M: 1200,
      MART_IDEAL_M: 800,
      MART_GOOD_M: 2500,
      FOOT_TRAFFIC_DEMAND_BLEND: 0.38,
      TOURISM_TRAFFIC_BOOST: 0.22,
      SOFT_CORRIDOR_FOOT_CAP: 0.4,
      SOFT_CORRIDOR_TRAFFIC_COMPOSITE_CAP: 0.64,
      SOFT_CORRIDOR_SUBWAY_WEIGHT: 0.1,
      SOFT_CORRIDOR_DEMAND_FOOT_BLEND: 0.68,
      SOFT_CORRIDOR_DEMAND_HH_WEIGHT: 0.32,
      SUBURBAN_TRAFFIC_CAP: 0.42,
      SUBURBAN_FOOT_CAP: 0.28,
      REGIONAL_URBAN_FOOT_CAP: 0.32,
      REGIONAL_URBAN_TRAFFIC_CAP: 0.44,
      REGIONAL_URBAN_DEMAND_HH_WEIGHT: 0.38,
      REGIONAL_URBAN_SALES_LOC_CAP: 0.92,
      REGIONAL_URBAN_VITALITY_CAP: 0.42,
      CORRIDOR_FOOT_CAP: 0.55,
      CORRIDOR_TRAFFIC_CAP: 0.72,
      CORRIDOR_CLUSTER_BOOST_MAX: 0.22,
      SUBURBAN_DEMAND_HH_WEIGHT: 0.26,
      HOSPITAL_DEMAND_IDEAL_M: 500,
      HOSPITAL_DEMAND_GOOD_M: 1500,
      HOSPITAL_DEMAND_WEIGHT: 0.12,
      HOSPITAL_TRAFFIC_WEIGHT_URBAN: 0.11,
      HOSPITAL_TRAFFIC_WEIGHT_SUBURBAN: 0.02,
      HNB_COLOCATION_SYNERGY_MAX: 7,
      FOOT_TRAFFIC_SCORE_CAPS: [
        [0.2, 0.4],
        [0.28, 0.48],
        [0.36, 0.56],
        [0.44, 0.66]
      ]
    },
    COMPETITION: {
      HNB_HIGH_THRESHOLD: 18,
      HNB_PENALTY_PER_STORE: 0.003,
      HNB_PENALTY_CAP: 0.05,
      HNB_BEAUTY_SWEET_MIN: 4,
      HNB_BEAUTY_SWEET_MAX: 18,
      HNB_BEAUTY_DEMAND_BONUS: 0.055,
      HNB_BEAUTY_COMP_START: 20,
      HNB_BEAUTY_COMP_PER: 0.005,
      HNB_BEAUTY_COMP_CAP: 0.09,
      BEAUTY_PRODUCT_SHARE: 0.3,
      PREMIUM_VITALITY_MIN: 0.52,
      PREMIUM_SCORE_FLOOR: 0.48,
      PREMIUM_SCORE_FLOOR_BOOST: 0.32,
      PHARMACY_OVERSAT_1KM: 14,
      PHARMACY_OVERSAT_2KM: 26,
      HUB_PHARMACY_SWEET_MIN: 3,
      HUB_PHARMACY_SWEET_MAX: 12,
      HUB_PHARMACY_BONUS: 0.09,
      RETAIL_ECOSYSTEM_HNB_MIN: 5,
      RETAIL_ECOSYSTEM_BONUS: 0.04,
      SYNERGY_BONUS_MAX: 4,
      HOSPITAL_COMP_BONUS_NEAR: 0.05,
      HOSPITAL_COMP_BONUS_MID: 0.025,
      SOFT_CORRIDOR_VITALITY_CAP: 0.34,
      SOFT_CORRIDOR_STRICT_CAP: 0.28
    },
    MEGA_HUB_KEYWORDS: [
      "명동", "을지로", "광화문", "종로", "동대문", "강남대로", "강남역", "서울역", "잠실", "코엑스", "여의도"
    ],
    SOFT_CORRIDOR_KEYWORDS: [
      "가로수", "신사동", "신사역", "도산대로", "도산"
    ],
    SUBURBAN_KEYWORDS: [
      "미사", "하남", "파주", "김포", "일산", "산본", "동탄", "광주", "이천", "여주",
      "양평", "의정부", "구리", "남양주", "시흥시", "안산", "수원", "용인", "오산", "평택"
    ],
    REGIONAL_CITY_KEYWORDS: [
      "인천", "부산", "대구", "광주", "대전", "울산", "세종"
    ],
    COMMERCIAL_CORRIDOR_KEYWORDS: [
      "시흥대로", "구로", "가산", "디지털단지", "관악", "금천", "독산", "문래", "영등포",
      "신도림", "여의도", "목동", "하남", "미사", "강변", "테크노", "역세권"
    ],
    PREMIUM_DISTRICT_KEYWORDS: [
      "성수", "강남", "홍대", "이태원", "압구정", "청담",
      "역삼", "한남", "삼성", "선릉", "논현", "건대", "왕십리", "판교", "분당"
    ],
    PHYSICAL: {
      AREA_IDEAL_PY: 200,
      AREA_MIN_PY: 150,
      AREA_FLOOR_PY: 120,
      PARKING_BONUS_HNB_CORRIDOR: 0.08,
      PARKING_BONUS_DEFAULT: 0.15,
      PARKING_PER_LEASE_PY: 0.5,
      PARKING_SCORE_CAP: 60,
      PARKING_PENALTY_HNB_CORRIDOR: 0.02,
      PARKING_PENALTY_DEFAULT: 0.05
    },
    VETO: {
      WAREHOUSE_1KM_MAX_TOTAL: 82,
      NO_PARKING_MAX_TOTAL: 72,
      RENT_2X_MAX_TOTAL: 78,
      AREA_UNDER_120_MAX_TOTAL: 70
    },
    FRANCHISE: {
      MARKET_DEALS_HIGH: 6,
      MARKET_DEALS_MID: 3,
      LEASING_SWEET_MIN: 0.65,
      LEASING_SWEET_MAX: 1.35
    }
  }
};
