import type { NextFunction, Request, Response } from "express";
import { getAuthAdmin } from "../firebase.js";

export type AuthUser = {
  uid: string;
  email?: string;
};

export type AuthedRequest = Request & {
  authUser?: AuthUser;
};

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Debes iniciar sesión" });
    return;
  }

  try {
    const decoded = await getAuthAdmin().verifyIdToken(header.slice(7));
    req.authUser = { uid: decoded.uid, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ error: "Sesión inválida o expirada" });
  }
}
