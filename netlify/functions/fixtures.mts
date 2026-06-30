export default async (req, context) => {
  const apiKey = Netlify.env.get("API_FOOTBALL_KEY");
  if (!apiKey) {
    return new Response(JSON.stringify({ response: [], note: "Pas de clé API" }), { headers: { "Content-Type": "application/json" } });
  }
  const url = new URL(req.url);
  const date = url.searchParams.get("date");
  const live = url.searchParams.get("live");
  let apiUrl = `https://v3.football.api-sports.io/fixtures?league=1&season=2026`;
  if (live === "true") apiUrl = `https://v3.football.api-sports.io/fixtures?live=all&league=1&season=2026`;
  else if (date) apiUrl += `&date=${date}`;
  try {
    const apiRes = await fetch(apiUrl, { headers: { "x-apisports-key": apiKey } });
    const data = await apiRes.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", "Cache-Control": "public, s-maxage=30" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};

export const config = { path: "/api/fixtures" };
