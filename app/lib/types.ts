import { Role } from "./roles";

export type AuthUser = {
  user_id: number;
  name: string;
  email: string;
  role: Role;
};
