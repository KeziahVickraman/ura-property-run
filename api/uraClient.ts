/**
 * URA (Urban Redevelopment Authority) Data Service Client
 * 
 * Flow:
 * 1. Trade AccessKey for today's Token:
 *    https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1
 *    Header -> AccessKey: <URA_ACCESS_KEY>
 * 
 * 2. Invoke dataset sending BOTH AccessKey and Token:
 *    https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1
 *    Headers -> AccessKey: <URA_ACCESS_KEY>, Token: <TOKEN>
 * 
 * Note: API keys are NEVER hardcoded. They are read from process.env.URA_ACCESS_KEY
 * or dynamically from the request headers ('AccessKey' or 'x-access-key').
 */

export interface TokenCache {
  token: string;
  dateKey: string;
  retrievedAt: number;
}

// In-memory token cache for daily token reuse
let cachedTokenInfo: TokenCache | null = null;

const URA_TOKEN_ENDPOINT = 'https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1';
const URA_DATA_ENDPOINT = 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1';

/**
 * Returns today's date in Singapore timezone (Asia/Singapore, UTC+8)
 */
export function getTodaySingaporeDate(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Singapore',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Resolves the URA AccessKey from environment or dynamic request header
 */
export function resolveAccessKey(requestHeaders?: Record<string, string | string[] | undefined>): string | null {
  const envKey = process.env.URA_ACCESS_KEY?.trim();
  if (envKey) return envKey;

  if (requestHeaders) {
    const headerKey = 
      requestHeaders['accesskey'] || 
      requestHeaders['AccessKey'] || 
      requestHeaders['x-access-key'] ||
      requestHeaders['X-Access-Key'];

    if (typeof headerKey === 'string' && headerKey.trim().length > 0) {
      return headerKey.trim();
    }
  }

  return null;
}

/**
 * Step 1: Trade the AccessKey for today's Token.
 * Caches the token for the day to avoid redundant daily token calls.
 */
export async function getUraDailyToken(
  accessKey: string,
  options: { forceRefresh?: boolean } = {}
): Promise<{ token: string; cached: boolean; dateKey: string }> {
  if (!accessKey) {
    throw new Error(
      'URA_ACCESS_KEY is required. Please set process.env.URA_ACCESS_KEY or pass the AccessKey header.'
    );
  }

  const todayKey = getTodaySingaporeDate();

  // Return cached token if valid for today and refresh is not forced
  if (
    !options.forceRefresh &&
    cachedTokenInfo &&
    cachedTokenInfo.token &&
    cachedTokenInfo.dateKey === todayKey
  ) {
    return {
      token: cachedTokenInfo.token,
      cached: true,
      dateKey: todayKey,
    };
  }

  const res = await fetch(URA_TOKEN_ENDPOINT, {
    method: 'GET',
    headers: {
      'AccessKey': accessKey,
      'User-Agent': 'Mozilla/5.0 (compatible; URADataServiceClient/1.0)',
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to request URA token: HTTP ${res.status} ${res.statusText}`
    );
  }

  const data = await res.json().catch(() => null);

  if (!data) {
    throw new Error('URA token service returned invalid or non-JSON response');
  }

  if (data.Status !== 'Success' && !data.Result) {
    throw new Error(
      data.Message || data.error || `URA Token Service Error (Status: ${data.Status || 'Unknown'})`
    );
  }

  const token = data.Result || data.token;
  if (!token) {
    throw new Error('URA Token Service did not return a valid Result token in the payload');
  }

  // Update in-memory cache
  cachedTokenInfo = {
    token,
    dateKey: todayKey,
    retrievedAt: Date.now(),
  };

  return {
    token,
    cached: false,
    dateKey: todayKey,
  };
}

/**
 * Step 2: Invoke URA Data Service sending BOTH headers (AccessKey and Token)
 * Endpoint: https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1
 */
export async function invokeUraDataset(params: {
  accessKey: string;
  service?: string;
  batch?: string | number;
  forceRefreshToken?: boolean;
}): Promise<any> {
  const {
    accessKey,
    service = 'PMI_Resi_Transaction',
    batch = 1,
    forceRefreshToken = false,
  } = params;

  // Obtain today's token (Step 1)
  const { token } = await getUraDailyToken(accessKey, { forceRefresh: forceRefreshToken });

  // Build target URL
  const queryParams = new URLSearchParams({
    service,
    batch: String(batch),
  });
  const url = `${URA_DATA_ENDPOINT}?${queryParams.toString()}`;

  // Execute request with BOTH headers (Step 2)
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'AccessKey': accessKey,
      'Token': token,
      'User-Agent': 'Mozilla/5.0 (compatible; URADataServiceClient/1.0)',
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`URA Data Service request failed: HTTP ${res.status} ${res.statusText}`);
  }

  const json = await res.json().catch(() => null);

  // If token was rejected or expired, retry once with a freshly obtained token
  if (
    json &&
    json.Status !== 'Success' &&
    typeof json.Message === 'string' &&
    (json.Message.toLowerCase().includes('token') || json.Message.toLowerCase().includes('invalid')) &&
    !forceRefreshToken
  ) {
    // Clear cache and retry once
    cachedTokenInfo = null;
    return invokeUraDataset({
      ...params,
      forceRefreshToken: true,
    });
  }

  return json;
}

/**
 * Helper to clear local token cache
 */
export function invalidateUraTokenCache(): void {
  cachedTokenInfo = null;
}
