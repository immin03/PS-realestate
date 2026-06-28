const VWORLD_API_KEY = process.env.VWORLD_API_KEY;

exports.handler = async function (event) {
  const q = event.queryStringParameters || {};
  const pnu = q.pnu || "";
  const stdrYear = q.stdrYear || new Date().getFullYear();

  if (!VWORLD_API_KEY) {
    return json(200, {
      ok: false,
      type: "land",
      optional: true,
      message: "VWORLD_API_KEY 환경변수가 없습니다."
    });
  }

  if (!pnu) {
    return json(200, {
      ok: false,
      type: "land",
      optional: true,
      message: "pnu가 필요합니다."
    });
  }

  const params = new URLSearchParams({
    pnu,
    stdrYear: String(stdrYear),
    format: "json",
    numOfRows: "10",
    pageNo: "1",
    key: VWORLD_API_KEY,
    domain: "phamasquare-site-report.netlify.app"
  });

  const url = `https://api.vworld.kr/ned/data/getLandCharacteristics?${params.toString()}`;

  try {
    const res = await fetchWithTimeout(url, 10000);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return json(200, {
      ok: res.ok,
      type: "land",
      optional: true,
      pnu,
      stdrYear,
      upstreamStatus: res.status,
      upstreamStatusText: res.statusText,
      requestUrl: url.replace(VWORLD_API_KEY, "HIDDEN_KEY"),
      data,
      message: res.ok ? undefined : `토지특성 API 응답 오류: HTTP ${res.status}`
    });
  } catch (error) {
    return json(200, {
      ok: false,
      type: "land",
      optional: true,
      pnu,
      stdrYear,
      message: "토지특성 API 호출 중 오류가 발생했습니다.",
      error: error.name === "AbortError" ? "요청 시간 초과" : error.message,
      data: null
    });
  }
};

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
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