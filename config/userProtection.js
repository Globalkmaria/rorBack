import { config } from ".";

export const getProtectedUserIds = () => {
  return config.userProtection.protectedUserIds;
};
