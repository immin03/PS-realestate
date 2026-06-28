const JUSO_API_KEY = process.env.JUSO_API_KEY;
const { fetchWithTimeout } = require("./_shared/fetchWithTimeout");

exports.handler = async function (event) {
  const q = event.queryStringParameters || {};
  const keyword = q.keyword || q.address || "";

  if (!JUSO_API_KEY) {
    return json(500, {
      ok: false,
      message: "JUSO_API_KEY 환경변수가 없습니다."
    });
  }

  if (!keyword) {
    return json(400, {
      ok: false,
      message: "keyword 또는 address가 필요합니다."
    });
  }

  const url =
    "https://business.juso.go.kr/addrlink/addrLinkApi.do" +
    `?confmKey=${encodeURIComponent(JUSO_API_KEY)}` +
    `&currentPage=1` +
    `&countPerPage=10` +
    `&keyword=${encodeURIComponent(keyword)}` +
    `&resultType=json`;

  try {
    const res = await fetchWithTimeout(url, {}, 12000);
    const data = await res.json();
    const errorCode = data?.results?.common?.errorCode;
    const errorMessage = data?.results?.common?.errorMessage;

    if (errorCode && errorCode !== "0") {
      return json(502, {
        ok: false,
        message: errorMessage || "도로명주소 검색 API 오류",
        errorCode
      });
    }

    const results = normalizeJusoResults(data?.results?.juso);
    const first = results[0] || null;

    return json(200, {
      ok: true,
      type: "juso",
      keyword,
      count: results.length,
      first,
      items: results.map(item => ({
        roadAddr: item.roadAddr,
        jibunAddr: item.jibunAddr,
        zipNo: item.zipNo,
        admCd: item.admCd,
        rnMgtSn: item.rnMgtSn,
        bdMgtSn: item.bdMgtSn,
        siNm: item.siNm,
        sggNm: item.sggNm,
        emdNm: item.emdNm,
        rn: item.rn,
        udrtYn: item.udrtYn,
        buldMnnm: item.buldMnnm,
        buldSlno: item.buldSlno
      })),
      requestUrl: url.replace(JUSO_API_KEY, "HIDDEN_KEY")
    });
  } catch (error) {
    return json(500, {
      ok: false,
      message: "도로명주소 검색 API 호출 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

function normalizeJusoResults(juso) {
  if (!juso) return [];
  if (Array.isArray(juso)) return juso;
  return [juso];
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
