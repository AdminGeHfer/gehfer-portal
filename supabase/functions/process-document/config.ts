export const CONFIG = {
  CHUNK_SIZE: 250,
  CHUNK_OVERLAP: 50,
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY: 1000,
  MAX_RETRY_DELAY: 10000,
  TIMEOUT: 10000,
  BATCH_SIZE: 2,
  INTER_CHUNK_DELAY: 500
};

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};