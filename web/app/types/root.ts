import type { Env } from "./env";
import type { User } from "./user";

export interface RootLoaderData {
  ENV: Env;
  locale: string;
  user?: User;
}
