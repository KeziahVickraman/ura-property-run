import type { IncomingMessage, ServerResponse } from 'http';
import {
  getUraDailyToken,
  resolveAccessKey,
  invalidateUraTokenCache,
  getTodaySingaporeDate,
} from './uraClient';

/**
 * Serverless handler for Trading URA AccessKey for Today's Daily Token
 * 
 * Endpoint:
 * GET /api/token
 * 
 * Invokes upstream:
 * https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1
 * Header -> AccessKey: <URA_ACCESS_KEY>
 */
export default async function handler(req: any, res: any) {
  // Allow CORS if queried from external or client
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccessKey, x-access-key');
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  try {
    const headers = req.headers || {};
    const accessKey = resolveAccessKey(headers);

    if (!accessKey) {
      res.statusCode = 401;
      const errorPayload = {
        success: false,
        error: 'URA_ACCESS_KEY is required.',
        message: 'No URA AccessKey detected. Please configure URA_ACCESS_KEY in your environment variables, or pass the AccessKey header.',
        hint: 'Trade AccessKey endpoint: https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1',
      };
      if (res.json) {
        return res.json(errorPayload);
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(errorPayload));
      return;
    }

    // Check if force refresh requested via query parameter
    const url = new URL(req.url || '', 'http://localhost');
    const forceRefresh = url.searchParams.get('refresh') === 'true';

    if (forceRefresh) {
      invalidateUraTokenCache();
    }

    const { token, cached, dateKey } = await getUraDailyToken(accessKey, {
      forceRefresh,
    });

    const successPayload = {
      success: true,
      service: 'URA Data Service Token Trader',
      status: 'Success',
      token,
      dateKey,
      cached,
      todaySingaporeDate: getTodaySingaporeDate(),
      upstreamEndpoint: 'https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1',
    };

    res.statusCode = 200;
    if (res.json) {
      return res.json(successPayload);
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(successPayload));
  } catch (error: any) {
    res.statusCode = 500;
    const errorPayload = {
      success: false,
      error: error?.message || 'Failed to trade URA token',
      upstreamEndpoint: 'https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1',
    };
    if (res.json) {
      return res.json(errorPayload);
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(errorPayload));
  }
}
