import tokenHandler from './token';
import transactionsHandler from './transactions';
import { resolveAccessKey, getTodaySingaporeDate } from './uraClient';

/**
 * Main Serverless API Entrypoint
 * Stored in /api folder at project root
 * 
 * Supports:
 * - GET /api/token -> Trades AccessKey for daily Token
 * - GET /api/transactions?batch=1 -> Invokes URA dataset with AccessKey + Token
 * - GET /api?action=health -> Status and configuration diagnostics
 */
export default async function handler(req: any, res: any) {
  const url = new URL(req.url || '', 'http://localhost');
  const pathname = url.pathname.replace(/\/$/, '');
  const action = url.searchParams.get('action');

  if (pathname === '/api/token' || action === 'token') {
    return tokenHandler(req, res);
  }

  if (action === 'health' || pathname === '/api/health') {
    const hasKey = !!resolveAccessKey(req.headers);
    const healthData = {
      status: 'ok',
      service: 'URA Serverless Connection',
      environmentKeyConfigured: hasKey,
      todaySingaporeDate: getTodaySingaporeDate(),
      endpoints: {
        token: '/api/token',
        transactions: '/api/transactions?batch=1',
        uraRoot: '/api',
      },
      upstreamUraEndpoints: {
        tokenTrader: 'https://eservice.ura.gov.sg/uraDataService/insertNewToken/v1',
        dataService: 'https://eservice.ura.gov.sg/uraDataService/invokeUraDS/v1?service=PMI_Resi_Transaction&batch=1',
      },
    };
    res.statusCode = 200;
    if (res.json) return res.json(healthData);
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(healthData));
  }

  return transactionsHandler(req, res);
}
