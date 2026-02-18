const USER_LIMIT = 2;
const SERVER_DAILY_LIMIT = 50;
const DAY_MS = 24 * 60 * 60 * 1000;

// userId : time[]
const store = new Map();

let serverCount = 0;
let serverResetAt = Date.now() + DAY_MS;

export function aiLimitCheckAndUpdateLimit(userKey) {
  const now = Date.now();
  const expire = now + DAY_MS;

  if (now > serverResetAt) {
    serverCount = 0;
    serverResetAt = now + DAY_MS;
  }

  if (serverCount >= SERVER_DAILY_LIMIT) return false;

  const userRequests = store.get(userKey) ?? [];

  if (userRequests[0] < now) userRequests.shift();

  if (userRequests.length >= USER_LIMIT) return false;

  userRequests.push(expire);
  store.set(userKey, userRequests);
  serverCount++;
  return true;
}
