const DATA_KEY = process.env.DATA_GO_KR_KEY;
const { fetchWithTimeout } = require("./_shared/fetchWithTimeout");

exports.handler = async function (event) {
  const q = event.queryStringParameters || {};
  const lawdCd = q.lawdCd;
  const dealYmd = q.dealYmd;

  if (!DATA_KEY) {
    return json(500, {
      ok: false,
      message: "DATA_GO_KR_KEY 환경변수가 없습니다."
    });
  }

  if (!lawdCd || !dealYmd) {
    return json(400, {
      ok: false,
      message: "lawdCd, dealYmd가 필요합니다."
    });
  }

  const url =
    "https://apis.data.go.kr/1613000/RTMSDataSvcNrgTrade/getRTMSDataSvcNrgTrade" +
    `?serviceKey=${encodeURIComponent(DATA_KEY)}` +
    `&LAWD_CD=${encodeURIComponent(lawdCd)}` +
    `&DEAL_YMD=${encodeURIComponent(dealYmd)}` +
    `&numOfRows=100` +
    `&pageNo=1`;

  try {
    const res = await fetchWithTimeout(url, {}, 20000);
    const text = await res.text();

    return json(200, {
      ok: true,
      type: "trade",
      raw: text
    });
  } catch (error) {
    return json(500, {
      ok: false,
      message: "실거래가 API 호출 중 오류가 발생했습니다.",
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