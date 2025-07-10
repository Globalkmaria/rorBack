import { config } from "./index.js";

export const getProtectedUserIds = () => {
  return config.userProtection.protectedUserIds;
};
