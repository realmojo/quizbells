/**
 * FCM v1 API용 OAuth 2.0 액세스 토큰 생성
 * Edge Runtime에서도 작동하도록 Web Crypto API 사용
 */

// JWT 헤더와 페이로드를 Base64 URL 인코딩
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// RSA-SHA256 서명 생성 (Web Crypto API 사용)
async function signJWT(
  header: string,
  payload: string,
  privateKey: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${header}.${payload}`);

  // PEM 형식의 개인 키를 CryptoKey로 변환
  const keyData = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");

  const keyBuffer = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBuffer.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    cryptoKey,
    data
  );

  return base64UrlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );
}

// JWT 생성
async function createJWT(
  clientEmail: string,
  privateKey: string,
  scope: string = "https://www.googleapis.com/auth/firebase.messaging"
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: clientEmail,
    sub: clientEmail,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600, // 1시간 유효
    scope: scope,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = await signJWT(encodedHeader, encodedPayload, privateKey);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// OAuth 2.0 액세스 토큰 요청
export async function getFCMAccessToken(): Promise<string> {
  const clientEmail = process.env.CLIENT_EMAIL;
  const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "CLIENT_EMAIL or PRIVATE_KEY environment variable is missing"
    );
  }

  const jwt = await createJWT(clientEmail, privateKey);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

