const KAKAO_REST_API_KEY = process.env.KAKAO_REST_API_KEY;
const { fetchWithTimeout } = require("./_shared/fetchWithTimeout");

exports.handler = async function (event) {
  const q = event.queryStringParameters || {};

  const x = q.x || q.lng;
  const y = q.y || q.lat;
  const radius = q.radius || "5000";
  const keyword = q.keyword || "";
  const category = q.category || "";
  const maxPages = Math.min(Math.max(Number(q.maxPages || 2), 1), 3);

  if (!KAKAO_REST_API_KEY) {
    return json(500, {
      ok: false,
      message: "KAKAO_REST_API_KEY 환경변수가 없습니다."
    });
  }

  if (!x || !y) {
    return json(400, {
      ok: false,
      message: "x/lng, y/lat 좌표가 필요합니다."
    });
  }

  if (!keyword && !category) {
    return json(400, {
      ok: false,
      message: "keyword 또는 category가 필요합니다."
    });
  }

  const baseUrl = category
    ? "https://dapi.kakao.com/v2/local/search/category.json"
    : "https://dapi.kakao.com/v2/local/search/keyword.json";

  const params = new URLSearchParams({
    x,
    y,
    radius,
    size: "15",
    sort: "distance"
  });

  if (category) params.set("category_group_code", category);
  if (keyword) params.set("query", keyword);

  try {
    const headers = { Authorization: `KakaoAK ${KAKAO_REST_API_KEY}` };
    const allDocuments = [];
    let meta = {};

    for (let page = 1; page <= maxPages; page++) {
      params.set("page", String(page));
      const url = `${baseUrl}?${params}`;
      const res = await fetchWithTimeout(url, { headers }, 12000);
      const data = await res.json();

      if (!res.ok) {
        return json(res.status, {
          ok: false,
          message: data.message || "카카오 장소검색 API 오류",
          meta: data.meta || {}
        });
      }

      meta = data.meta || meta;
      const docs = data.documents || [];
      if (!docs.length) break;

      allDocuments.push(...docs);
      if (meta.is_end) break;
    }

    const items = dedupePlaces(allDocuments).map(item => ({
      place_name: item.place_name,
      category_name: item.category_name,
      distance: item.distance,
      road_address_name: item.road_address_name,
      address_name: item.address_name,
      phone: item.phone,
      x: item.x,
      y: item.y,
      place_url: item.place_url
    }));

    const totalCount = meta.pageable_count ?? items.length;

    return json(200, {
      ok: true,
      type: "places",
      keyword,
      category,
      x,
      y,
      radius,
      count: items.length,
      totalCount,
      items,
      meta
    });
  } catch (error) {
    return json(500, {
      ok: false,
      message: "카카오 장소검색 API 호출 중 오류가 발생했습니다.",
      error: error.message
    });
  }
};

function dedupePlaces(list) {
  const seen = new Map();
  for (const item of list) {
    const key = `${item.x},${item.y},${item.place_name}`;
    seen.set(key, item);
  }
  return [...seen.values()];
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
