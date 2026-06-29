const DATA_KEY = process.env.DATA_GO_KR_KEY;

exports.handler = async function (event) {
  const q = event.queryStringParameters || {};

  const sigunguCd = q.sigunguCd;
  const bjdongCd = q.bjdongCd;
  const bun = q.bun || "0000";
  const ji = q.ji || "0000";
  const platGbCd = q.platGbCd || "0";

  if (!DATA_KEY) {
    return json(500, {
      ok: false,
      message: "DATA_GO_KR_KEY 환경변수가 없습니다."
    });
  }

  if (!sigunguCd || !bjdongCd) {
    return json(400, {
      ok: false,
      message: "sigunguCd, bjdongCd가 필요합니다."
    });
  }

  const commonParams =
    `?serviceKey=${encodeURIComponent(DATA_KEY)}` +
    `&sigunguCd=${encodeURIComponent(sigunguCd)}` +
    `&bjdongCd=${encodeURIComponent(bjdongCd)}` +
    `&platGbCd=${encodeURIComponent(platGbCd)}` +
    `&bun=${encodeURIComponent(bun)}` +
    `&ji=${encodeURIComponent(ji)}` +
    `&_type=json`;

  // 1. 표제부: 기본 건물정보
  const titleUrl =
    "https://apis.data.go.kr/1613000/BldRgstHubService/getBrTitleInfo" +
    commonParams +
    `&numOfRows=100` +
    `&pageNo=1`;

  // 1-2. 총괄표제부: 단지·지식산업센터 등
  const recapUrl =
    "https://apis.data.go.kr/1613000/BldRgstHubService/getBrRecapTitleInfo" +
    commonParams +
    `&numOfRows=100` +
    `&pageNo=1`;

  // 2. 층별개요: 층별 용도/면적 후보
  const floorUrl =
    "https://apis.data.go.kr/1613000/BldRgstHubService/getBrFlrOulnInfo" +
    commonParams +
    `&numOfRows=100` +
    `&pageNo=1`;

  // 3. 전유공용면적: 호실/전유부 면적 후보
  const exposeUrl =
    "https://apis.data.go.kr/1613000/BldRgstHubService/getBrExposPubuseAreaInfo" +
    commonParams +
    `&numOfRows=100` +
    `&pageNo=1`;

  try {
    // 표제부는 핵심 데이터 — 총괄표제부는 병행 조회
    const [titleResult, recapResult] = await Promise.all([
      fetchJson(titleUrl),
      fetchJsonWithTimeout(recapUrl, 8000).catch(err => ({ error: err.message }))
    ]);

    const recapData = recapResult?.error ? null : recapResult;
    const recapError = recapResult?.error || null;

    // 층별개요는 실패해도 전체 실패로 보지 않습니다.
    let floorResult = null;
    let floorError = null;

    try {
      floorResult = await fetchJsonWithTimeout(floorUrl, 8000);
    } catch (error) {
      floorError = error.message || "층별개요 API 호출 실패";
    }

    // 전유공용면적도 실패해도 전체 실패로 보지 않습니다.
    let exposeResult = null;
    let exposeError = null;

    try {
      exposeResult = await fetchJsonWithTimeout(exposeUrl, 8000);
    } catch (error) {
      exposeError = error.message || "전유공용면적 API 호출 실패";
    }

    return json(200, {
      ok: true,
      type: "building",
      requestUrl: titleUrl.replace(DATA_KEY, "HIDDEN_KEY"),
      recapRequestUrl: recapUrl.replace(DATA_KEY, "HIDDEN_KEY"),
      floorRequestUrl: floorUrl.replace(DATA_KEY, "HIDDEN_KEY"),
      exposeRequestUrl: exposeUrl.replace(DATA_KEY, "HIDDEN_KEY"),
      data: titleResult,
      recapData,
      recapError,
      floorData: floorResult,
      floorError,
      exposeData: exposeResult,
      exposeError
    });
  } catch (error) {
    return json(500, {
      ok: false,
      message: "건축물대장 표제부 API 호출 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

async function fetchJson(url) {
  const res = await fetch(url);
  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function fetchJsonWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();

    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  } finally {
    clearTimeout(timeout);
  }
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(body)
  };
}