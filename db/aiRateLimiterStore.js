const LIMIT = 2;

// userId : time[]
const store = new Map();

export function aiLimitCheckAndUpdateLimit(userKey) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const expire = now + day;

  const userRequests = store.get(userKey) ?? [];

  if (userRequests[0] < now) userRequests.shift();

  if (userRequests.length >= LIMIT) return false;

  userRequests.push(expire);
  store.set(userKey, userRequests);
  return true;
}
