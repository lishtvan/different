export interface SessionPlugin {
  start: (
    userInfo: { providerId: string; name: string },
    ip: string
  ) => Promise<{ token: string; userId: string }>;
  destroy: (token: string) => Promise<void>;
}
