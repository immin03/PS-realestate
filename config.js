window.APP_CONFIG = {
  HB_KEYWORDS: ["올리브영", "다이소", "롭스", "왓슨스", "부츠"],
  WAREHOUSE_PHARMACY_NAMES: [],
  WEIGHTS: { demand: 25, traffic: 20, competition: 20, economics: 20, physical: 15 },
  BENCHMARK_RENT_PER_PY: 9.0,
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
      MART_GOOD_M: 2500
    },
    PHYSICAL: {
      AREA_IDEAL_PY: 200,
      AREA_MIN_PY: 150,
      AREA_FLOOR_PY: 120
    },
    VETO: {
      WAREHOUSE_1KM_MAX_TOTAL: 82,
      NO_PARKING_MAX_TOTAL: 72,
      RENT_2X_MAX_TOTAL: 78,
      AREA_UNDER_120_MAX_TOTAL: 70
    }
  }
};
