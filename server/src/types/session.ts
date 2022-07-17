export interface SessionPlugin {
  start: (
    userInfo: { email: string; name: string },
    ip: string
  ) => Promise<{ token: string; accountId: string; isProfileCreated: boolean }>;
  destroy: (token: string) => Promise<void>;
}
