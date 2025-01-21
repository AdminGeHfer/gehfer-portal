const RNC_CACHE_KEY = 'rncs';
const CACHE_TIME = 1000 * 60 * 10; // 10 minutes

export const getRNCFromCache = () => {
  const cachedData = sessionStorage.getItem(RNC_CACHE_KEY);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_TIME) {
      return data;
    }
  }
  return null;
};

export const setRNCCache = (data) => {
  try {
    sessionStorage.setItem(RNC_CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  } catch {
    console.warn('Cache storage failed, clearing old data');
    sessionStorage.clear();
    sessionStorage.setItem(RNC_CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
  }
};