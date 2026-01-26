import jwt from "jsonwebtoken";
import { Role } from "./roles";

const JWT_SECRET = process.env.JWT_SECRET as string;

export type JwtPayload = {
  userId: number;
  role: Role;
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string):JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
