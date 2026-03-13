import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export type JwtPayload = {
    userId: number;
};

export function signToken(payload: JwtPayload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "7d", // ✅ increased to 7 days
    });
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
}