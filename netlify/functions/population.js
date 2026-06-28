const DATA_KEY = process.env.DATA_GO_KR_KEY;
const { fetchWithTimeout } = require("./_shared/fetchWithTimeout");

exports.handler = async function (event) {
  const q = event.queryStringParameters || {};

  const roadNmCd = q.roadNmCd || "";
  const srchFrYm = q.srchFrYm || q.statsYm || "";
  const srchToYm = q.srchToYm || q.statsYm || "";
  const regSeCd = q.regSeCd || "1"; // 1: 전체

  if (!DATA_KEY) {
    return json(500, {
      ok: false,
      message: "DATA_GO_KR_KEY 환경변수가 없습니다."
    });
  }

  if (!roadNmCd || !srchFrYm || !srchToYm) {
    return json(400, {
      ok: false,
      message: "roadNmCd, srchFrYm, srchToYm가 필요합니다.",
      received: { roadNmCd, srchFrYm, srchToYm, regSeCd },
      note: "이 API는 도로명 텍스트가 아니라 도로명코드 roadNmCd로 조회합니다."
    });
  }

  const url =
    "https://apis.data.go.kr/1741000/rnPpltnHhStus/selectRnPpltnHhStus" +
    `?serviceKey=${encodeURIComponent(DATA_KEY)}` +
    `&roadNmCd=${encodeURIComponent(roadNmCd)}` +
    `&srchFrYm=${encodeURIComponent(srchFrYm)}` +
    `&srchToYm=${encodeURIComponent(srchToYm)}` +
    `&regSeCd=${encodeURIComponent(regSeCd)}` +
    `&numOfRows=100` +
    `&pageNo=1` +
    `&type=json`;

  try {
    const res = await fetchWithTimeout(url, {}, 20000);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return json(200, {
      ok: true,
      type: "population",
      requestUrl: url.replace(DATA_KEY, "HIDDEN_KEY"),
      data
    });
  } catch (error) {
    return json(500, {
      ok: false,
      message: "인구 API 호출 중 오류가 발생했습니다.",
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