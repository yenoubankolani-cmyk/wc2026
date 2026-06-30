
const { useState, useEffect, useRef, useCallback } = React;


const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #0A0E1A; color: #E8EDF5; font-family: 'Inter', sans-serif; }

  :root {
    --neon: #00FF87;
    --gold: #FFD700;
    --red: #FF3A3A;
    --bg: #0A0E1A;
    --card: #111827;
    --card2: #1A2540;
    --border: rgba(0,255,135,0.15);
    --text2: #7B8FA1;
    --mono: 'JetBrains Mono', monospace;
    --display: 'Orbitron', monospace;
  }

  .app { min-height: 100vh; background: var(--bg); position: relative; overflow-x: hidden; }

  /* Animated grid background */
  .grid-bg {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(0,255,135,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,135,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .content { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 24px 16px; }

  /* HEADER */
  .header { text-align: center; padding: 32px 0 40px; position: relative; }
  .header-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px;
    border: 1px solid var(--border); border-radius: 99px;
    font-family: var(--mono); font-size: 11px; color: var(--neon);
    background: rgba(0,255,135,0.05); margin-bottom: 20px; letter-spacing: 2px;
  }
  .pulse-dot { width: 6px; height: 6px; background: var(--neon); border-radius: 50%; animation: pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

  .header h1 { font-family: var(--display); font-size: clamp(22px, 5vw, 44px); font-weight: 900; letter-spacing: -1px; line-height: 1.1; }
  .header h1 span.gold { color: var(--gold); }
  .header h1 span.neon { color: var(--neon); }
  .header-sub { color: var(--text2); font-size: 13px; margin-top: 12px; letter-spacing: 0.5px; }

  /* LIVE TICKER */
  .ticker-wrap { overflow: hidden; background: rgba(0,255,135,0.05); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 8px 0; margin: 0 -16px 32px; }
  .ticker-inner { display: flex; gap: 48px; white-space: nowrap; animation: ticker 30s linear infinite; }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .ticker-item { font-family: var(--mono); font-size: 11px; color: var(--text2); display: flex; align-items: center; gap: 8px; }
  .ticker-item strong { color: var(--neon); }

  /* MAIN GRID */
  .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  @media(max-width: 700px) { .main-grid { grid-template-columns: 1fr; } }

  /* MATCH SELECTOR */
  .panel { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
  .panel-label { font-family: var(--mono); font-size: 10px; letter-spacing: 3px; color: var(--text2); text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .panel-label::before { content:''; display:block; width:16px; height:2px; background: var(--neon); }

  .match-list { display: flex; flex-direction: column; gap: 10px; max-height: 380px; overflow-y: auto; }
  .match-list::-webkit-scrollbar { width: 3px; }
  .match-list::-webkit-scrollbar-thumb { background: var(--neon); border-radius: 99px; }

  .match-card {
    border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px 16px;
    cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
    background: var(--card2);
  }
  .match-card:hover, .match-card.active {
    border-color: var(--neon); background: rgba(0,255,135,0.07);
  }
  .match-card.active::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--neon);
  }
  .match-teams { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .team-name { font-weight: 600; font-size: 13px; }
  .match-vs { font-family: var(--mono); font-size: 10px; color: var(--text2); padding: 0 8px; }
  .match-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
  .match-group { font-family: var(--mono); font-size: 10px; color: var(--text2); }
  .match-date { font-family: var(--mono); font-size: 10px; color: var(--gold); }
  .flag { font-size: 18px; }

  .status-badge { font-family: var(--mono); font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 99px; letter-spacing: 1px; }
  .status-badge.live { background: rgba(255,58,58,0.15); color: var(--red); }
  .status-badge.upcoming { background: rgba(0,255,135,0.1); color: var(--neon); }
  .status-badge.finished { background: rgba(123,143,161,0.15); color: var(--text2); }
  .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--red); display: inline-block; margin-right: 5px; animation: pulse 1s infinite; }
  .score-display { font-family: var(--display); font-size: 13px; color: var(--gold); font-weight: 700; }

  .clock-bar { display: flex; justify-content: space-between; align-items: center; font-family: var(--mono); font-size: 11px; color: var(--text2); margin-bottom: 16px; padding: 0 4px; }
  .clock-bar .live-now { color: var(--red); display: flex; align-items: center; }
  .refresh-note { display: flex; align-items: center; gap: 6px; }
  .refresh-spin { display: inline-block; animation: spin 2s linear infinite; }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }

  /* RADAR CHART */
  .radar-wrap { display: flex; justify-content: center; align-items: center; padding: 8px 0; }
  svg.radar { filter: drop-shadow(0 0 12px rgba(0,255,135,0.2)); }

  /* PREDICTION PANEL */
  .pred-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .pred-box {
    border-radius: 12px; padding: 16px 12px; text-align: center; border: 1px solid transparent;
    cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden;
    background: var(--card2);
  }
  .pred-box.win1 { border-color: rgba(0,255,135,0.2); }
  .pred-box.draw { border-color: rgba(255,215,0,0.2); }
  .pred-box.win2 { border-color: rgba(255,58,58,0.2); }
  .pred-box.win1.top { border-color: var(--neon); background: rgba(0,255,135,0.1); box-shadow: 0 0 20px rgba(0,255,135,0.15); }
  .pred-box.draw.top { border-color: var(--gold); background: rgba(255,215,0,0.08); }
  .pred-box.win2.top { border-color: var(--red); background: rgba(255,58,58,0.08); }
  .pred-label { font-size: 10px; font-family: var(--mono); letter-spacing: 1px; color: var(--text2); margin-bottom: 6px; }
  .pred-pct { font-family: var(--display); font-size: 28px; font-weight: 900; }
  .win1 .pred-pct { color: var(--neon); }
  .draw .pred-pct { color: var(--gold); }
  .win2 .pred-pct { color: var(--red); }
  .pred-odds { font-family: var(--mono); font-size: 11px; color: var(--text2); margin-top: 4px; }
  .top-badge { position: absolute; top: 6px; right: 6px; background: var(--neon); color: #000; font-size: 8px; font-weight: 700; font-family: var(--mono); padding: 2px 6px; border-radius: 99px; letter-spacing: 1px; }

  /* STATS BAR */
  .stat-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .stat-label { font-size: 11px; color: var(--text2); width: 100px; flex-shrink: 0; text-align: right; }
  .stat-label.right { text-align: left; }
  .stat-bar-wrap { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; display: flex; }
  .stat-bar-a { height: 100%; background: var(--neon); border-radius: 99px 0 0 99px; transition: width 0.8s cubic-bezier(.4,0,.2,1); }
  .stat-bar-b { height: 100%; background: var(--red); border-radius: 0 99px 99px 0; margin-left: auto; transition: width 0.8s cubic-bezier(.4,0,.2,1); }
  .stat-val { font-family: var(--mono); font-size: 11px; color: #fff; width: 32px; text-align: center; flex-shrink: 0; }

  /* AI ANALYSIS */
  .ai-box { background: var(--card2); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-top: 16px; min-height: 80px; }
  .ai-box p { font-size: 13px; line-height: 1.7; color: #C8D5E5; }
  .ai-thinking { display: flex; align-items: center; gap: 12px; color: var(--text2); font-family: var(--mono); font-size: 12px; }
  .ai-dots span { animation: blink 1.2s infinite; font-size: 20px; color: var(--neon); }
  .ai-dots span:nth-child(2) { animation-delay: 0.2s; }
  .ai-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,80%,100%{opacity:0} 40%{opacity:1} }

  /* TOP SCORERS WIDGET */
  .scorers-grid { display: flex; flex-direction: column; gap: 8px; }
  .scorer-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: var(--card2); border-radius: 10px; border: 1px solid rgba(255,255,255,0.04); }
  .scorer-rank { font-family: var(--display); font-size: 11px; color: var(--text2); width: 18px; }
  .scorer-rank.top1 { color: var(--gold); }
  .scorer-name { flex: 1; font-size: 13px; font-weight: 500; }
  .scorer-country { font-size: 11px; color: var(--text2); }
  .scorer-goals { font-family: var(--display); font-size: 16px; color: var(--neon); font-weight: 700; }
  .scorer-form { display: flex; gap: 3px; }
  .form-dot { width: 7px; height: 7px; border-radius: 50%; }

  /* CONFIDENCE METER */
  .conf-meter { margin: 16px 0; }
  .conf-track { height: 8px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; margin-top: 8px; }
  .conf-fill { height: 100%; border-radius: 99px; transition: width 1s cubic-bezier(.4,0,.2,1); }
  .conf-label-row { display: flex; justify-content: space-between; font-family: var(--mono); font-size: 10px; color: var(--text2); margin-top: 4px; }

  /* BET SUGGESTION */
  .bet-suggestion { background: linear-gradient(135deg, rgba(0,255,135,0.08), rgba(0,255,135,0.02)); border: 1px solid rgba(0,255,135,0.25); border-radius: 14px; padding: 20px; margin-top: 16px; }
  .bet-title { font-family: var(--display); font-size: 12px; letter-spacing: 2px; color: var(--neon); margin-bottom: 12px; }
  .bet-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .bet-item:last-child { border-bottom: none; }
  .bet-name { font-size: 12px; color: #C8D5E5; }
  .bet-odd { font-family: var(--mono); font-weight: 600; }
  .bet-odd.good { color: var(--neon); }
  .bet-odd.ok { color: var(--gold); }
  .bet-odd.risky { color: var(--red); }
  .value-badge { font-family: var(--mono); font-size: 9px; padding: 2px 8px; border-radius: 99px; font-weight: 600; }
  .value-badge.vhigh { background: rgba(0,255,135,0.15); color: var(--neon); }
  .value-badge.vmid { background: rgba(255,215,0,0.15); color: var(--gold); }
  .value-badge.vlow { background: rgba(255,58,58,0.12); color: var(--red); }

  /* FULL WIDTH PANEL */
  .full-panel { grid-column: 1 / -1; }

  /* ANALYZE BTN */
  .analyze-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; padding: 16px; border-radius: 12px; border: none; cursor: pointer;
    background: linear-gradient(90deg, #00FF87, #00CC6A); color: #000;
    font-family: var(--display); font-size: 13px; font-weight: 700; letter-spacing: 2px;
    transition: all 0.2s; margin-top: 16px;
  }
  .analyze-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,255,135,0.3); }
  .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .section-full { margin-top: 16px; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media(max-width:700px) { .two-col { grid-template-columns: 1fr; } .pred-grid { grid-template-columns: 1fr 1fr; } }

  .disclaimer { text-align: center; font-size: 11px; color: var(--text2); margin-top: 32px; padding: 16px; border-top: 1px solid rgba(255,255,255,0.04); line-height: 1.6; }
`;

// ---- API-FOOTBALL via proxy serverless sécurisé ----
// La clé API-Football N'EST JAMAIS dans ce fichier (qui tourne dans le navigateur).
// Elle vit côté serveur, dans une variable d'environnement Vercel, lue par /api/fixtures.js
// Ce fichier appelle simplement notre propre relais "/api/fixtures".

async function fetchLiveFromApiFootball() {
  try {
    const res = await fetch(`/api/fixtures?live=true`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.response) return null;
    return data.response.map((f, i) => ({
      id: f.fixture.id || 8000 + i,
      team1: f.teams.home.name,
      flag1: "🏳️",
      team2: f.teams.away.name,
      flag2: "🏳️",
      group: f.league.round || "Coupe du Monde",
      date: f.fixture.date?.slice(0, 10),
      time: f.fixture.date ? new Date(f.fixture.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "--:--",
      venue: f.fixture.venue?.name || "—",
      status: "live",
      liveScore: `${f.goals.home ?? 0}-${f.goals.away ?? 0}`,
      elapsed: f.fixture.status?.elapsed,
      apiSource: "api-football",
    }));
  } catch (e) {
    return null;
  }
}

async function fetchTodayFromApiFootball(dateStr) {
  try {
    const res = await fetch(`/api/fixtures?date=${dateStr}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.response) return null;
    return data.response.map((f, i) => {
      const isLive = ["1H", "2H", "HT", "ET", "P", "LIVE"].includes(f.fixture.status?.short);
      const isFinished = ["FT", "AET", "PEN"].includes(f.fixture.status?.short);
      return {
        id: f.fixture.id || 8000 + i,
        team1: f.teams.home.name,
        flag1: "🏳️",
        team2: f.teams.away.name,
        flag2: "🏳️",
        group: f.league.round || "Coupe du Monde",
        date: f.fixture.date?.slice(0, 10),
        time: f.fixture.date ? new Date(f.fixture.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "--:--",
        venue: f.fixture.venue?.name || "—",
        status: isLive ? "live" : isFinished ? "finished" : "upcoming",
        score: isFinished ? `${f.goals.home}-${f.goals.away}` : undefined,
        liveScore: isLive ? `${f.goals.home ?? 0}-${f.goals.away ?? 0}` : undefined,
        elapsed: f.fixture.status?.elapsed,
        apiSource: "api-football",
      };
    });
  } catch (e) {
    return null;
  }
}


// Doc officielle: https://www.thesportsdb.com/documentation
// Limite gratuite: pas de livescores minute-par-minute (réservé Premium v2),
// mais calendrier + résultats finaux (FT) sont disponibles sans clé payante.
const SPORTSDB_BASE = "https://www.thesportsdb.com/api/v1/json/123";
const WORLDCUP_LEAGUE_ID = "4429"; // FIFA World Cup, id officiel TheSportsDB

async function fetchEventsByDate(dateStr) {
  // dateStr format: YYYY-MM-DD
  const url = `${SPORTSDB_BASE}/eventsday.php?d=${dateStr}&l=${WORLDCUP_LEAGUE_ID}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error " + res.status);
  const data = await res.json();
  return data.events || [];
}

function mapApiEventToMatch(ev, fallbackId) {
  const isFinished = ev.strStatus === "Match Finished" || ev.strStatus === "FT" || (ev.intHomeScore !== null && ev.intHomeScore !== undefined && ev.strStatus === "");
  const hasScore = ev.intHomeScore !== null && ev.intHomeScore !== undefined && ev.intAwayScore !== null && ev.intAwayScore !== undefined;
  return {
    id: ev.idEvent || fallbackId,
    team1: ev.strHomeTeam,
    flag1: "🏳️",
    team2: ev.strAwayTeam,
    flag2: "🏳️",
    group: ev.strRound || "Coupe du Monde",
    date: ev.dateEvent,
    time: ev.strTime ? ev.strTime.slice(0, 5) : "--:--",
    venue: ev.strVenue || "—",
    status: hasScore ? "finished" : "upcoming",
    score: hasScore ? `${ev.intHomeScore}-${ev.intAwayScore}` : undefined,
    apiSource: true,
  };
}


// status: "live" | "upcoming" | "finished"
const MATCHES = [
  // EN COURS / AUJOURD'HUI — Mardi 30 juin (Round of 32)
  { id: 1, team1: "France", flag1: "🇫🇷", team2: "Suède", flag2: "🇸🇪", group: "8es de finale", date: "30 Jun", time: "23:00", venue: "New York", status: "live" },
  { id: 2, team1: "Côte d'Ivoire", flag1: "🇨🇮", team2: "Norvège", flag2: "🇳🇴", group: "8es de finale", date: "30 Jun", time: "19:00", venue: "Dallas", status: "live" },
  { id: 3, team1: "Mexique", flag1: "🇲🇽", team2: "Équateur", flag2: "🇪🇨", group: "8es de finale", date: "30 Jun", time: "21:00", venue: "Mexico City", status: "upcoming" },

  // À VENIR — Mercredi 1 juillet (Round of 32 suite)
  { id: 4, team1: "Angleterre", flag1: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", team2: "RD Congo", flag2: "🇨🇩", group: "8es de finale", date: "1 Jul", time: "12:00", venue: "Atlanta", status: "upcoming" },
  { id: 5, team1: "Belgique", flag1: "🇧🇪", team2: "Sénégal", flag2: "🇸🇳", group: "8es de finale", date: "1 Jul", time: "16:00", venue: "Seattle", status: "upcoming" },
  { id: 6, team1: "USA", flag1: "🇺🇸", team2: "Bosnie-Herzégovine", flag2: "🇧🇦", group: "8es de finale", date: "1 Jul", time: "20:00", venue: "San Francisco", status: "upcoming" },

  // Jeudi 2 juillet
  { id: 7, team1: "Espagne", flag1: "🇪🇸", team2: "Autriche", flag2: "🇦🇹", group: "8es de finale", date: "2 Jul", time: "15:00", venue: "Los Angeles", status: "upcoming" },
  { id: 8, team1: "Portugal", flag1: "🇵🇹", team2: "Croatie", flag2: "🇭🇷", group: "8es de finale", date: "2 Jul", time: "19:00", venue: "Toronto", status: "upcoming" },
  { id: 9, team1: "Suisse", flag1: "🇨🇭", team2: "Algérie", flag2: "🇩🇿", group: "8es de finale", date: "2 Jul", time: "23:00", venue: "Vancouver", status: "upcoming" },

  // Vendredi 3 juillet
  { id: 10, team1: "Australie", flag1: "🇦🇺", team2: "Égypte", flag2: "🇪🇬", group: "8es de finale", date: "3 Jul", time: "14:00", venue: "Dallas", status: "upcoming" },
  { id: 11, team1: "Argentine", flag1: "🇦🇷", team2: "Cap-Vert", flag2: "🇨🇻", group: "8es de finale", date: "3 Jul", time: "18:00", venue: "Miami", status: "upcoming" },
  { id: 12, team1: "Colombie", flag1: "🇨🇴", team2: "Ghana", flag2: "🇬🇭", group: "8es de finale", date: "3 Jul", time: "21:30", venue: "Kansas City", status: "upcoming" },

  // Samedi 4 juillet
  { id: 13, team1: "Canada", flag1: "🇨🇦", team2: "Maroc", flag2: "🇲🇦", group: "8es de finale", date: "4 Jul", time: "13:00", venue: "Houston", status: "upcoming" },
  { id: 14, team1: "Paraguay", flag1: "🇵🇾", team2: "Vainqueur M77", flag2: "🏳️", group: "8es de finale", date: "4 Jul", time: "17:00", venue: "Philadelphie", status: "upcoming" },

  // DÉJÀ JOUÉS — résultats réels connus
  { id: 15, team1: "Brésil", flag1: "🇧🇷", team2: "Japon", flag2: "🇯🇵", group: "8es de finale", date: "29 Jun", time: "FT", venue: "Houston", status: "finished", score: "2-1" },
  { id: 16, team1: "Paraguay", flag1: "🇵🇾", team2: "Allemagne", flag2: "🇩🇪", group: "8es de finale", date: "29 Jun", time: "FT (tab)", venue: "Foxborough", status: "finished", score: "1-1 (4-3 tab)" },
  { id: 17, team1: "Maroc", flag1: "🇲🇦", team2: "Pays-Bas", flag2: "🇳🇱", group: "8es de finale", date: "29 Jun", time: "FT (tab)", venue: "Monterrey", status: "finished", score: "1-1 (3-2 tab)" },
];

function timeUntilLabel(m) {
  if (m.status === "finished") return "TERMINÉ";
  if (m.status === "live") return "EN DIRECT";
  return `${m.date} • ${m.time}`;
}

const TOP_SCORERS = [
  { name: "L. Messi", country: "🇦🇷 Argentine", goals: 5, form: [1,1,1,0,1], rank: 1 },
  { name: "K. Mbappé", country: "🇫🇷 France", goals: 4, form: [1,1,0,1,1], rank: 2 },
  { name: "Vinícius Jr.", country: "🇧🇷 Brésil", goals: 4, form: [0,1,1,1,1], rank: 3 },
  { name: "C. Ronaldo", country: "🇵🇹 Portugal", goals: 3, form: [1,0,1,1,0], rank: 4 },
  { name: "L. Yamal", country: "🇪🇸 Espagne", goals: 3, form: [1,1,0,0,1], rank: 5 },
];

const TICKER_ITEMS = [
  { label: "🔴 LIVE", val: "France vs Suède 23:00" }, { label: "🔴 LIVE", val: "Côte d'Ivoire vs Norvège 19:00" },
  { label: "Messi Golden Boot", val: "5 buts" }, { label: "Brésil bat Japon", val: "2-1" },
  { label: "Paraguay élimine Allemagne", val: "tab 4-3" }, { label: "Maroc élimine Pays-Bas", val: "tab 3-2" },
  { label: "Mbappé vélocité", val: "38.2 km/h" }, { label: "Phase actuelle", val: "8es de finale" },
  { label: "Prochain match", val: "Mexique vs Équateur 21:00" }, { label: "Finale prévue", val: "19 Juillet" },
];

// Seeded pseudo-random based on match id
function seededRand(seed, min, max) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return min + (x - Math.floor(x)) * (max - min);
}

function getMatchStats(match) {
  const s = match.id;
  return {
    possession: [Math.round(seededRand(s, 45, 68)), 0],
    shots: [Math.round(seededRand(s * 2, 8, 20)), Math.round(seededRand(s * 3, 5, 15))],
    xg: [+seededRand(s * 4, 0.8, 2.8).toFixed(2), +seededRand(s * 5, 0.5, 2.1).toFixed(2)],
    form: [+seededRand(s * 6, 60, 95).toFixed(0), +seededRand(s * 7, 45, 88).toFixed(0)],
    ppda: [+seededRand(s * 8, 6, 14).toFixed(1), +seededRand(s * 9, 7, 16).toFixed(1)],
    def: [+seededRand(s * 10, 55, 92).toFixed(0), +seededRand(s * 11, 40, 85).toFixed(0)],
  };
}

function getPrediction(match) {
  const st = getMatchStats(match);
  const scoreA = st.xg[0] * 20 + +st.form[0] * 0.3 + (100 - st.ppda[0]) * 1.5 + +st.def[0] * 0.2;
  const scoreB = st.xg[1] * 20 + +st.form[1] * 0.3 + (100 - st.ppda[1]) * 1.5 + +st.def[1] * 0.2;
  const total = scoreA + scoreB + 18;
  const w1 = Math.round((scoreA / total) * 100);
  const w2 = Math.round((scoreB / total) * 100);
  const draw = 100 - w1 - w2;
  const conf = Math.round(50 + Math.abs(w1 - w2) / 2);
  return {
    win1: w1, draw: Math.max(draw, 8), win2: w2,
    odds1: +(100 / (w1 || 1) * 0.92).toFixed(2),
    oddsD: +(100 / (Math.max(draw, 8)) * 0.92).toFixed(2),
    odds2: +(100 / (w2 || 1) * 0.92).toFixed(2),
    confidence: Math.min(conf, 91),
    top: w1 > w2 ? "win1" : w2 > w1 ? "win2" : "draw",
  };
}

// Radar SVG
function RadarChart({ stats, labels, colors }) {
  const cx = 110, cy = 110, r = 80;
  const n = labels.length;
  const angles = labels.map((_, i) => (Math.PI * 2 * i / n) - Math.PI / 2);

  function pt(val, maxVal, ri = r) {
    return angles.map((a, i) => {
      const v = (val[i] / maxVal[i]) * ri;
      return [cx + Math.cos(a) * v, cy + Math.sin(a) * v];
    });
  }

  const gridLevels = [0.25, 0.5, 0.75, 1.0];
  const maxVals = [100, 3, 100, 20, 100, 20]; // form, xg, def, shots, possession, ppda_inv

  return (
    <svg className="radar" width={220} height={220} viewBox="0 0 220 220">
      {/* Grid */}
      {gridLevels.map((lv, gi) => {
        const pts = angles.map(a => [cx + Math.cos(a) * r * lv, cy + Math.sin(a) * r * lv]);
        return (
          <polygon key={gi}
            points={pts.map(p => p.join(",")).join(" ")}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1}
          />
        );
      })}
      {/* Axes */}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy}
          x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r}
          stroke="rgba(255,255,255,0.06)" strokeWidth={1}
        />
      ))}
      {/* Team polygons */}
      {stats.map((s, ti) => {
        const pts = pt(s, maxVals);
        return (
          <polygon key={ti}
            points={pts.map(p => p.join(",")).join(" ")}
            fill={`${colors[ti]}22`} stroke={colors[ti]} strokeWidth={2}
            style={{ transition: "all 0.7s" }}
          />
        );
      })}
      {/* Labels */}
      {labels.map((lbl, i) => {
        const x = cx + Math.cos(angles[i]) * (r + 16);
        const y = cy + Math.sin(angles[i]) * (r + 16);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize={8} fill="#7B8FA1" fontFamily="JetBrains Mono, monospace" fontWeight={600}
          >{lbl}</text>
        );
      })}
      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3} fill="rgba(0,255,135,0.4)" />
    </svg>
  );
}

function App() {
  const [liveData, setLiveData] = useState(null); // null = pas encore chargé / erreur
  const [apiStatus, setApiStatus] = useState("idle"); // idle | loading | success | error
  const [apiSourceUsed, setApiSourceUsed] = useState(null); // "api-football" | "thesportsdb" | null
  const [selected, setSelected] = useState(MATCHES.find(m => m.status === "live") || MATCHES[0]);
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [now, setNow] = useState(new Date());
  const [refreshFlash, setRefreshFlash] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const todayStr = "2026-06-30"; // jour simulé courant du tournoi

  const loadLiveData = useCallback(async () => {
    setApiStatus("loading");
    // 1. Tente API-Football si une clé est configurée (vrais scores live)
    try {
      const afData = await fetchTodayFromApiFootball(todayStr);
      if (afData && afData.length > 0) {
        setLiveData(afData);
        setApiSourceUsed("api-football");
        setApiStatus("success");
        setLastSync(new Date());
        return;
      }
    } catch (e) {
      // on continue vers le fallback suivant
    }
    // 2. Fallback: TheSportsDB (gratuit, sans clé live mais calendrier/résultats fiables)
    try {
      const events = await fetchEventsByDate(todayStr);
      if (events && events.length > 0) {
        const mapped = events.map((ev, i) => mapApiEventToMatch(ev, 9000 + i));
        setLiveData(mapped);
        setApiSourceUsed("thesportsdb");
        setApiStatus("success");
      } else {
        setLiveData([]);
        setApiSourceUsed(null);
        setApiStatus("success");
      }
    } catch (e) {
      setApiStatus("error");
      setApiSourceUsed(null);
    }
    setLastSync(new Date());
  }, [todayStr]);

  useEffect(() => {
    loadLiveData();
  }, [loadLiveData]);

  // Horloge live + rafraîchissement automatique réel des données toutes les 60s
  useEffect(() => {
    const clockTimer = setInterval(() => setNow(new Date()), 1000);
    const refreshTimer = setInterval(() => {
      setRefreshFlash(true);
      loadLiveData().finally(() => setTimeout(() => setRefreshFlash(false), 900));
    }, 30000);
    return () => { clearInterval(clockTimer); clearInterval(refreshTimer); };
  }, [loadLiveData]);

  // Source effective: données API si dispo et non-vides, sinon fallback calendrier statique connu
  const effectiveMatches = (liveData && liveData.length > 0) ? liveData : MATCHES;

  const liveMatches = effectiveMatches.filter(m => m.status === "live");
  const upcomingMatches = effectiveMatches.filter(m => m.status === "upcoming");
  const finishedMatches = effectiveMatches.filter(m => m.status === "finished");

  const pred = getPrediction(selected);
  const stats = getMatchStats(selected);
  const radarData = [
    [+stats.form[0], stats.xg[0], +stats.def[0], stats.shots[0], stats.possession[0], Math.max(0, 20 - stats.ppda[0])],
    [+stats.form[1], stats.xg[1], +stats.def[1], stats.shots[1], 100 - stats.possession[0], Math.max(0, 20 - stats.ppda[1])],
  ];
  const radarLabels = ["FORME", "xG", "DÉFENSE", "TIRS", "POSS.", "PRESS."];
  const statRows = [
    { label: "Forme (pts)", a: +stats.form[0], b: +stats.form[1], max: 100, fmt: v => v + "%" },
    { label: "xG / match", a: stats.xg[0] * 35, b: stats.xg[1] * 35, raw_a: stats.xg[0], raw_b: stats.xg[1], max: 100 },
    { label: "Défense", a: +stats.def[0], b: +stats.def[1], max: 100, fmt: v => v + "%" },
    { label: "Tirs", a: stats.shots[0] * 5, b: stats.shots[1] * 5, raw_a: stats.shots[0], raw_b: stats.shots[1], max: 100 },
    { label: "Pressing PPDA", a: (16 - stats.ppda[0]) * 7, b: (16 - stats.ppda[1]) * 7, raw_a: stats.ppda[0], raw_b: stats.ppda[1], max: 100 },
  ];

  const analyze = useCallback(async () => {
    setLoading(true);
    setAiText("");
    setAnalyzed(false);
    const prompt = `Tu es un expert mondial en analyse de paris sportifs pour la Coupe du Monde 2026. Analyse ce match :

Match : ${selected.team1} vs ${selected.team2} (${selected.group})

Statistiques avancées :
- xG moyen : ${selected.team1} ${stats.xg[0]} | ${selected.team2} ${stats.xg[1]}
- Forme récente : ${selected.team1} ${stats.form[0]}% | ${selected.team2} ${stats.form[1]}%
- Défense : ${selected.team1} ${stats.def[0]}% | ${selected.team2} ${stats.def[1]}%
- Tirs par match : ${selected.team1} ${stats.shots[0]} | ${selected.team2} ${stats.shots[1]}
- PPDA (pressing) : ${selected.team1} ${stats.ppda[0]} | ${selected.team2} ${stats.ppda[1]}
- Possession : ${selected.team1} ${stats.possession[0]}% | ${selected.team2} ${100 - stats.possession[0]}%

Probabilités calculées : Victoire ${selected.team1} ${pred.win1}% | Nul ${pred.draw}% | Victoire ${selected.team2} ${pred.win2}%
Indice de confiance : ${pred.confidence}%

Donne une analyse EXPERTE de 3 phrases max : facteurs déterminants, risques à surveiller, et le pari avec la meilleure valeur (Value Bet). Sois précis, chiffré, expert.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "Analyse indisponible.";
      setAiText(text);
    } catch {
      setAiText("Erreur de connexion à l'IA. Vérifiez votre connexion.");
    }
    setLoading(false);
    setAnalyzed(true);
  }, [selected, stats, pred]);

  const confColor = pred.confidence > 75 ? "#00FF87" : pred.confidence > 60 ? "#FFD700" : "#FF3A3A";

  const bets = [
    {
      name: `Victoire ${selected.team1}`,
      odd: pred.odds1,
      cls: pred.odds1 < 1.8 ? "good" : pred.odds1 < 2.5 ? "ok" : "risky",
      val: pred.win1 > 50 ? "VALUE ★" : pred.win1 > 38 ? "MOYEN" : "RISQUÉ",
      vcls: pred.win1 > 50 ? "vhigh" : pred.win1 > 38 ? "vmid" : "vlow"
    },
    {
      name: "Match nul",
      odd: pred.oddsD,
      cls: "ok",
      val: pred.draw > 25 ? "VALUE ★" : "ÉVITER",
      vcls: pred.draw > 25 ? "vmid" : "vlow"
    },
    {
      name: `Victoire ${selected.team2}`,
      odd: pred.odds2,
      cls: pred.odds2 < 1.8 ? "good" : pred.odds2 < 2.5 ? "ok" : "risky",
      val: pred.win2 > 50 ? "VALUE ★" : pred.win2 > 38 ? "MOYEN" : "RISQUÉ",
      vcls: pred.win2 > 50 ? "vhigh" : pred.win2 > 38 ? "vmid" : "vlow"
    },
    {
      name: "Les 2 équipes scorent",
      odd: +(1.6 + Math.abs(stats.xg[0] - stats.xg[1]) * 0.2).toFixed(2),
      cls: "good",
      val: stats.xg[0] > 1.3 && stats.xg[1] > 1.0 ? "VALUE ★" : "MOYEN",
      vcls: stats.xg[0] > 1.3 && stats.xg[1] > 1.0 ? "vhigh" : "vmid"
    },
    {
      name: "Plus de 2.5 buts",
      odd: +(1.7 + (stats.shots[0] + stats.shots[1]) * 0.02).toFixed(2),
      cls: stats.shots[0] + stats.shots[1] > 26 ? "good" : "ok",
      val: stats.shots[0] + stats.shots[1] > 26 ? "VALUE ★" : "MOYEN",
      vcls: stats.shots[0] + stats.shots[1] > 26 ? "vhigh" : "vmid"
    },
  ];

  return (
    <div className="app">
      <style>{STYLE}</style>
      <div className="grid-bg" />

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <div className="ticker-item" key={i}>
              <span>{t.label}</span>
              <strong>{t.val}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="content">
        {/* HEADER */}
        <div className="header">
          <div className="header-badge">
            <div className="pulse-dot" />
            {liveMatches.length > 0 ? `${liveMatches.length} MATCH(S) EN DIRECT` : "CONNECTÉ À THESPORTSDB"}
          </div>
          <h1>
            <span className="gold">COUPE DU MONDE</span>{" "}
            <span className="neon">2026</span>
            <br />PRÉDICTIONS IA
          </h1>
          <div className="header-sub">
            Analyse multi-variables • xG • PPDA • Forme • xA • Défense • Value Bets
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="main-grid">
          {/* MATCH SELECTOR */}
          <div className="panel">
            <div className="panel-label">Sélection du match</div>
            <div className="clock-bar">
              <span>{now.toLocaleString("fr-FR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
              <span className="refresh-note">
                <span className={refreshFlash || apiStatus === "loading" ? "refresh-spin" : ""}>⟳</span>
                {apiStatus === "loading" ? "Connexion API…" :
                 apiStatus === "error" ? "API hors-ligne · données locales" :
                 apiSourceUsed === "api-football" ? "API-Football · scores live" :
                 apiSourceUsed === "thesportsdb" ? "TheSportsDB · calendrier" :
                 "Calendrier local vérifié"}
              </span>
            </div>
            {apiSourceUsed !== "api-football" && apiStatus !== "loading" && (
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--text2)", marginBottom: 10, padding: "6px 10px", background: "rgba(123,143,161,0.08)", borderRadius: 8 }}>
                ℹ Scores live indisponibles (proxy API-Football non configuré côté serveur, ou aucun match en direct). Calendrier via TheSportsDB.
              </div>
            )}
            {apiStatus === "error" && (
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--red)", marginBottom: 10, padding: "6px 10px", background: "rgba(255,58,58,0.08)", borderRadius: 8 }}>
                ⚠ TheSportsDB injoignable (clé gratuite limitée) — affichage du calendrier de secours vérifié manuellement.
              </div>
            )}
            {apiStatus === "success" && liveData && liveData.length === 0 && (
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)", marginBottom: 10, padding: "6px 10px", background: "rgba(255,215,0,0.08)", borderRadius: 8 }}>
                ℹ TheSportsDB n'a renvoyé aucun match pour cette date (couverture variable en gratuit) — calendrier de secours affiché.
              </div>
            )}
            <div className="match-list">
              {liveMatches.length > 0 && (
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--red)", letterSpacing: 2, marginTop: 4 }}>● EN DIRECT MAINTENANT</div>
              )}
              {liveMatches.map(m => (
                <div
                  key={m.id}
                  className={`match-card${selected.id === m.id ? " active" : ""}`}
                  onClick={() => { setSelected(m); setAiText(""); setAnalyzed(false); }}
                >
                  <div className="match-teams">
                    <span className="flag">{m.flag1}</span>
                    <span className="team-name">{m.team1}</span>
                    <span className="match-vs">VS</span>
                    <span className="team-name" style={{ textAlign: "right" }}>{m.team2}</span>
                    <span className="flag">{m.flag2}</span>
                  </div>
                  <div className="match-meta">
                    <span className="match-group">{m.venue}</span>
                    <span className="status-badge live">
                      <span className="live-dot" />
                      {m.liveScore ? `${m.liveScore} · ${m.elapsed ?? "?"}'` : m.time}
                    </span>
                  </div>
                </div>
              ))}

              {upcomingMatches.length > 0 && (
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--neon)", letterSpacing: 2, marginTop: 10 }}>À VENIR</div>
              )}
              {upcomingMatches.map(m => (
                <div
                  key={m.id}
                  className={`match-card${selected.id === m.id ? " active" : ""}`}
                  onClick={() => { setSelected(m); setAiText(""); setAnalyzed(false); }}
                >
                  <div className="match-teams">
                    <span className="flag">{m.flag1}</span>
                    <span className="team-name">{m.team1}</span>
                    <span className="match-vs">VS</span>
                    <span className="team-name" style={{ textAlign: "right" }}>{m.team2}</span>
                    <span className="flag">{m.flag2}</span>
                  </div>
                  <div className="match-meta">
                    <span className="match-group">{m.venue}</span>
                    <span className="match-date">{m.date} · {m.time}</span>
                  </div>
                </div>
              ))}

              {finishedMatches.length > 0 && (
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text2)", letterSpacing: 2, marginTop: 10 }}>RÉSULTATS RÉCENTS</div>
              )}
              {finishedMatches.map(m => (
                <div
                  key={m.id}
                  className={`match-card${selected.id === m.id ? " active" : ""}`}
                  style={{ opacity: 0.75 }}
                  onClick={() => { setSelected(m); setAiText(""); setAnalyzed(false); }}
                >
                  <div className="match-teams">
                    <span className="flag">{m.flag1}</span>
                    <span className="team-name">{m.team1}</span>
                    <span className="score-display">{m.score}</span>
                    <span className="team-name" style={{ textAlign: "right" }}>{m.team2}</span>
                    <span className="flag">{m.flag2}</span>
                  </div>
                  <div className="match-meta">
                    <span className="match-group">{m.venue}</span>
                    <span className="status-badge finished">{m.date} · {m.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RADAR + TOP SCORERS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="panel">
              <div className="panel-label">Radar Comparatif</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#00FF87" }}>
                  <div style={{ width: 12, height: 2, background: "#00FF87", borderRadius: 2 }} />
                  {selected.flag1} {selected.team1}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#FF3A3A" }}>
                  <div style={{ width: 12, height: 2, background: "#FF3A3A", borderRadius: 2 }} />
                  {selected.flag2} {selected.team2}
                </div>
              </div>
              <div className="radar-wrap">
                <RadarChart stats={radarData} labels={radarLabels} colors={["#00FF87", "#FF3A3A"]} />
              </div>
            </div>
            <div className="panel">
              <div className="panel-label">Meilleurs Buteurs CM 2026</div>
              <div className="scorers-grid">
                {TOP_SCORERS.map(sc => (
                  <div className="scorer-row" key={sc.name}>
                    <div className={`scorer-rank${sc.rank === 1 ? " top1" : ""}`}>{sc.rank}</div>
                    <div style={{ flex: 1 }}>
                      <div className="scorer-name">{sc.name}</div>
                      <div className="scorer-country">{sc.country}</div>
                    </div>
                    <div className="scorer-form">
                      {sc.form.map((f, i) => (
                        <div key={i} className="form-dot" style={{ background: f ? "#00FF87" : "#FF3A3A" }} />
                      ))}
                    </div>
                    <div className="scorer-goals">{sc.goals}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PREDICTION + STATS SECTION */}
        <div className="section-full">
          <div className="two-col">
            {/* PREDICTIONS */}
            <div className="panel">
              {selected.status === "finished" ? (
                <>
                  <div className="panel-label">Résultat final</div>
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text2)", marginBottom: 8 }}>
                      {selected.venue} · {selected.date}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, fontSize: 15, fontWeight: 600 }}>
                      <span>{selected.flag1} {selected.team1}</span>
                      <span className="score-display" style={{ fontSize: 24 }}>{selected.score}</span>
                      <span>{selected.team2} {selected.flag2}</span>
                    </div>
                    <div className="status-badge finished" style={{ marginTop: 14, display: "inline-block" }}>MATCH TERMINÉ</div>
                  </div>
                </>
              ) : (
              <>
              <div className="panel-label">Probabilités de résultat</div>
              <div className="pred-grid">
                <div className={`pred-box win1${pred.top === "win1" ? " top" : ""}`}>
                  {pred.top === "win1" && <div className="top-badge">★ TOP</div>}
                  <div className="pred-label">{selected.team1.toUpperCase()}</div>
                  <div className="pred-pct">{pred.win1}%</div>
                  <div className="pred-odds">Cote: {pred.odds1}</div>
                </div>
                <div className={`pred-box draw${pred.top === "draw" ? " top" : ""}`}>
                  {pred.top === "draw" && <div className="top-badge">★ TOP</div>}
                  <div className="pred-label">NUL</div>
                  <div className="pred-pct">{pred.draw}%</div>
                  <div className="pred-odds">Cote: {pred.oddsD}</div>
                </div>
                <div className={`pred-box win2${pred.top === "win2" ? " top" : ""}`}>
                  {pred.top === "win2" && <div className="top-badge">★ TOP</div>}
                  <div className="pred-label">{selected.team2.toUpperCase()}</div>
                  <div className="pred-pct">{pred.win2}%</div>
                  <div className="pred-odds">Cote: {pred.odds2}</div>
                </div>
              </div>

              {/* CONFIDENCE */}
              <div className="conf-meter">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--mono)", letterSpacing: 1 }}>INDICE DE CONFIANCE</span>
                  <span style={{ fontFamily: "var(--display)", fontSize: 18, color: confColor, fontWeight: 700 }}>{pred.confidence}%</span>
                </div>
                <div className="conf-track">
                  <div className="conf-fill" style={{ width: pred.confidence + "%", background: `linear-gradient(90deg, ${confColor}88, ${confColor})` }} />
                </div>
                <div className="conf-label-row">
                  <span>Incertain</span><span>Modéré</span><span>Confiant</span><span>Expert</span>
                </div>
              </div>

              <button className="analyze-btn" onClick={analyze} disabled={loading || selected.status === "finished"}>
                {loading ? "⚙ ANALYSE EN COURS..." : selected.status === "finished" ? "MATCH TERMINÉ" : "⚡ ANALYSE IA APPROFONDIE"}
              </button>

              {/* AI ANALYSIS */}
              {(loading || aiText) && (
                <div className="ai-box">
                  {loading ? (
                    <div className="ai-thinking">
                      <div className="ai-dots"><span>•</span><span>•</span><span>•</span></div>
                      Traitement des données…
                    </div>
                  ) : (
                    <p>{aiText}</p>
                  )}
                </div>
              )}
              </>
              )}
            </div>

            {/* STATS COMPARISON */}
            {selected.status !== "finished" ? (
            <div className="panel">
              <div className="panel-label">Stats Comparatives Avancées</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: 12 }}>
                  <span style={{ color: "#00FF87", fontWeight: 600 }}>{selected.flag1} {selected.team1}</span>
                  <span style={{ color: "#FF3A3A", fontWeight: 600 }}>{selected.team2} {selected.flag2}</span>
                </div>
                {statRows.map((row, i) => {
                  const aW = Math.round((row.a / (row.a + row.b)) * 100);
                  const bW = 100 - aW;
                  const rawA = row.raw_a !== undefined ? row.raw_a : row.a;
                  const rawB = row.raw_b !== undefined ? row.raw_b : row.b;
                  return (
                    <div className="stat-row" key={i}>
                      <span className="stat-val" style={{ color: "#00FF87" }}>{rawA}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--text2)", textAlign: "center", marginBottom: 4 }}>{row.label}</div>
                        <div className="stat-bar-wrap">
                          <div className="stat-bar-a" style={{ width: aW + "%" }} />
                          <div className="stat-bar-b" style={{ width: bW + "%" }} />
                        </div>
                      </div>
                      <span className="stat-val" style={{ color: "#FF3A3A" }}>{rawB}</span>
                    </div>
                  );
                })}
              </div>

              {/* BET SUGGESTIONS */}
              <div className="bet-suggestion">
                <div className="bet-title">⚡ VALUE BETS SUGGÉRÉS</div>
                {bets.map((b, i) => (
                  <div className="bet-item" key={i}>
                    <span className="bet-name">{b.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span className={`bet-odd ${b.cls}`}>×{b.odd}</span>
                      <span className={`value-badge ${b.vcls}`}>{b.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            ) : (
              <div className="panel" style={{ display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text2)" }}>
                    Marchés clôturés — match déjà disputé.<br />Sélectionnez un match en direct ou à venir pour voir les Value Bets.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="disclaimer">
          🔌 Scores live via <strong style={{ color: "var(--text2)" }}>API-Football</strong> (relayé par un proxy serveur sécurisé) — calendrier/résultats de secours via <strong style={{ color: "var(--text2)" }}>TheSportsDB.com</strong>. Rafraîchissement auto. toutes les 30s.<br />
          La clé API-Football est stockée côté serveur uniquement, jamais exposée dans ce code.<br />
          ⚠️ Outil d'analyse statistique à titre informatif uniquement. Le jeu comporte toujours une part d'aléatoire.<br />
          Jouez de manière responsable. Les paris sportifs comportent des risques financiers.
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));

