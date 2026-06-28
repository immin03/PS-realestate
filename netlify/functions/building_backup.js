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

  const url =
    "https://apis.data.go.kr/1613000/BldRgstHubService/getBrTitleInfo" +
    `?serviceKey=${encodeURIComponent(DATA_KEY)}` +
    `&sigunguCd=${encodeURIComponent(sigunguCd)}` +
    `&bjdongCd=${encodeURIComponent(bjdongCd)}` +
    `&platGbCd=${encodeURIComponent(platGbCd)}` +
    `&bun=${encodeURIComponent(bun)}` +
    `&ji=${encodeURIComponent(ji)}` +
    `&numOfRows=10` +
    `&pageNo=1` +
    `&_type=json`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return json(200, {
      ok: true,
      type: "building",
      requestUrl: url.replace(DATA_KEY, "HIDDEN_KEY"),
      data
    });
  } catch (error) {
    return json(500, {
      ok: false,
      message: "건축물대장 API 호출 중 오류가 발생했습니다.",
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