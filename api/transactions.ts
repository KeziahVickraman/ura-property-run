import {
  invokeUraDataset,
  resolveAccessKey,
} from './uraClient';

/**
 * Serverless handler for URA Dataset Calls (sends BOTH AccessKey and Token)
 * 
 * Endpoint:
 * GET /api/transactions?batch=1&service=PMI_Resi_Transaction
 * 
 * Invokes upstream:
 * https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1
 * Headers -> AccessKey: <URA_ACCESS_KEY>, Token: <TOKEN>
 */
export default async function handler(req: any, res: any) {
  // CORS configuration
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
        step1: 'Trade AccessKey: https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1',
        step2: 'Invoke Data: https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1',
      };
      if (res.json) {
        return res.json(errorPayload);
      }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(errorPayload));
      return;
    }

    // Extract query parameters
    const url = new URL(req.url || '', 'http://localhost');
    const service = url.searchParams.get('service') || 'PMI_Resi_Transaction';
    const batch = url.searchParams.get('batch') || '1';

    // Invoke URA dataset with both AccessKey and daily Token
    const uraResponse = await invokeUraDataset({
      accessKey,
      service,
      batch,
    });

    res.statusCode = 200;
    if (res.json) {
      return res.json(uraResponse);
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(uraResponse));
  } catch (error: any) {
    res.statusCode = 500;
    const errorPayload = {
      success: false,
      error: error?.message || 'Failed to fetch URA dataset',
      service: 'PMI_Resi_Transaction',
      upstreamEndpoint: 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1',
    };
    if (res.json) {
      return res.json(errorPayload);
    }
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(errorPayload));
  }
}
