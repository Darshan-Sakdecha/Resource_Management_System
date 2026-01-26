import { Role } from "./roles";

export type AuthUser = {
  user_id: number;
  name: string;
  email: string;
  role_id: number;
  roles: {
    role_name: Role;
  };
};
