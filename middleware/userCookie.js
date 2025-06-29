import { v4 as uuidv4 } from "uuid";
import requestIp from "request-ip";

// ip : anonId
const store = new Map();

export const checkUserCookieOrSet = async (req, res, next) => {
  let anonId = req.cookies?.anon_id;
  const ip = requestIp.getClientIp(req);

  if (!ip) {
    return res.status(400).send("Unable to get client IP");
  }

  if (!anonId) {
    anonId = store.get(ip);

    if (!anonId) {
      anonId = uuidv4();
      store.set(ip, anonId);
    }

    res.cookie("anon_id", anonId, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      path: "/",
    });
  }

  res.anonId = anonId;

  next();
};
