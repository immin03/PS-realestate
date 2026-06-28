const VWORLD_API_KEY = process.env.VWORLD_API_KEY;

exports.handler = async function (event) {
  const q = event.queryStringParameters || {};
  const pnu = q.pnu || "";

  if (!VWORLD_API_KEY) {
    return json(200, {
      ok: false,
      type: "landuse",
      optional: true,
      message: "VWORLD_API_KEY 환경변수가 없습니다."
    });
  }

  if (!pnu) {
    return json(200, {
      ok: false,
      type: "landuse",
      optional: true,
      message: "pnu가 필요합니다."
    });
  }

  const cleanDomain = String(q.domain || "phamasquare-site-report.netlify.app")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const params = new URLSearchParams({
    pnu,
    cnflcAt: "1",
    format: "json",
    numOfRows: "100",
    pageNo: "1",
    key: VWORLD_API_KEY,
    domain: cleanDomain
  });

  const url = `https://api.vworld.kr/ned/data/getLandUseAttr?${params.toString()}`;

  try {
    const res = await fetchWithTimeout(url, 15000);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    const totalCount = Number(
      data?.landUses?.totalCount ??
      data?.response?.body?.totalCount ??
      0
    );

    return json(200, {
      ok: res.status >= 200 && res.status < 300,
      type: "landuse",
      optional: true,
      pnu,
      totalCount,
      upstreamStatus: res.status,
      upstreamStatusText: res.statusText,
      data,
      message: res.status >= 200 && res.status < 300
        ? undefined
        : `VWorld 토지이용계획 API 응답 오류: HTTP ${res.status}`
    });
  } catch (error) {
    return json(200, {
      ok: false,
      type: "landuse",
      optional: true,
      pnu,
      message: "토지이용계획 API 호출 중 오류가 발생했습니다.",
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