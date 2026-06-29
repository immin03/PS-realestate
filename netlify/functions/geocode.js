const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const { fetchWithTimeout } = require("./_shared/fetchWithTimeout");

exports.handler = async function (event) {
  const q = event.queryStringParameters || {};
  const query = q.query || q.keyword || q.address || "";

  if (!KAKAO_REST_API_KEY) {
    return json(500, {
      ok: false,
      message: "KAKAO_REST_API_KEY 환경변수가 없습니다."
    });
  }

  if (!query) {
    return json(400, {
      ok: false,
      message: "query, keyword 또는 address가 필요합니다."
    });
  }

  const url =
    "https://dapi.kakao.com/v2/local/search/address.json" +
    `?query=${encodeURIComponent(query)}` +
    "&size=5";

  try {
    const res = await fetchWithTimeout(
      url,
      { headers: { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` } },
      12000
    );
    const data = await res.json();

    if (!res.ok) {
      return json(res.status, {
        ok: false,
        message: data.message || "카카오 주소 검색 API 오류"
      });
    }

    const docs = data.documents || [];
    const first = docs[0] || null;

    if (!first) {
      return json(404, {
        ok: false,
        message: "주소를 찾을 수 없습니다. 지번 또는 도로명 주소로 다시 입력해 주세요."
      });
    }

    return json(200, {
      ok: true,
      type: "geocode",
      query,
      count: docs.length,
      first,
      items: docs
    });
  } catch (error) {
    return json(500, {
      ok: false,
      message: "카카오 주소 검색 API 호출 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

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
