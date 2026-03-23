/**
 * Google Indexing API를 사용해 퀴즈벨 URL 인덱싱 요청
 *
 * 사용법:
 *   node scripts/indexing.mjs                  # 모든 /today URL 인덱싱
 *   node scripts/indexing.mjs --dates 3        # 최근 3일치 날짜별 URL도 포함
 *   node scripts/indexing.mjs --type toss      # 특정 타입만
 *   node scripts/indexing.mjs --url https://quizbells.com/quiz/toss/today  # 단일 URL
 */

import { google } from "googleapis";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CREDENTIALS_PATH = join(__dirname, "google-credentials.json");
const SITE_URL = "https://quizbells.com";

// 퀴즈 타입 목록
const QUIZ_TYPES = [
  "toss", "cashwalk", "shinhan", "kakaobank", "nh", "kakaopay",
  "bitbunny", "okcashbag", "cashdoc", "kbstar", "3o3", "doctornow",
  "mydoctor", "hpoint", "climate", "skstoa", "hanabank", "auction",
  "kbank", "monimo", "buzzvil",
];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = { dates: 0, type: null, url: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--dates" && args[i + 1]) {
      options.dates = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === "--type" && args[i + 1]) {
      options.type = args[i + 1];
      i++;
    } else if (args[i] === "--url" && args[i + 1]) {
      options.url = args[i + 1];
      i++;
    }
  }
  return options;
}

function getDateString(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function buildUrls(options) {
  if (options.url) return [options.url];

  const types = options.type ? [options.type] : QUIZ_TYPES;
  const urls = [];

  // /today URLs
  for (const t of types) {
    urls.push(`${SITE_URL}/quiz/${t}/today`);
  }

  // 날짜별 URLs
  if (options.dates > 0) {
    for (let d = 0; d < options.dates; d++) {
      const dateStr = getDateString(d);
      for (const t of types) {
        urls.push(`${SITE_URL}/quiz/${t}/${dateStr}`);
      }
    }
  }

  return urls;
}

async function getAuthClient() {
  const credentials = JSON.parse(readFileSync(CREDENTIALS_PATH, "utf-8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/indexing"],
  });
  return auth.getClient();
}

async function submitUrl(client, url, type = "URL_UPDATED") {
  try {
    const res = await client.request({
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      method: "POST",
      data: { url, type },
    });
    return { url, status: res.status, ok: true };
  } catch (err) {
    const status = err.response?.status || "unknown";
    const message = err.response?.data?.error?.message || err.message;
    return { url, status, message, ok: false };
  }
}

// Google Indexing API 일일 할당량: 200건/일
// 배치 처리 시 rate limit 방지를 위해 딜레이 추가
const BATCH_SIZE = 10;
const DELAY_MS = 1000;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const options = parseArgs();
  const urls = buildUrls(options);

  console.log(`\n🔔 퀴즈벨 Google Indexing`);
  console.log(`📋 총 ${urls.length}개 URL 인덱싱 요청\n`);

  if (urls.length > 200) {
    console.warn(`⚠️  일일 할당량(200건) 초과! ${urls.length}개 중 200개만 처리합니다.\n`);
    urls.length = 200;
  }

  const client = await getAuthClient();

  let success = 0;
  let fail = 0;

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((url) => submitUrl(client, url))
    );

    for (const r of results) {
      if (r.ok) {
        console.log(`✅ ${r.url}`);
        success++;
      } else {
        console.log(`❌ ${r.url} — ${r.status}: ${r.message}`);
        fail++;
      }
    }

    // 마지막 배치가 아니면 딜레이
    if (i + BATCH_SIZE < urls.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\n📊 결과: 성공 ${success} / 실패 ${fail} / 총 ${urls.length}`);
}

main().catch(console.error);
