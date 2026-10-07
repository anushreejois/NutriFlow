import { getAuth } from "@clerk/express";
import { Request, RequestHandler } from "express";
import User from "../models/User";

declare global {
  namespace Express {
    interface Request {
      authenticatedClerkId?: string;
      currentUserId?: string;
    }
  }
}

type UserIdentity = { _id: string | { toString(): string } };

export const createRequireClerkAuth = (
  resolveClerkUserId: (req: Request) => string | null,
): RequestHandler => (req, res, next) => {
  const clerkUserId = resolveClerkUserId(req);
  if (!clerkUserId) {
    return res.status(401).json({ error: "Authentication required." });
  }

  req.authenticatedClerkId = clerkUserId;
  next();
};

export const requireClerkAuth = createRequireClerkAuth(
  (req) => getAuth(req).userId,
);

export const createRequireCurrentUser = (
  findUserByClerkId: (clerkUserId: string) => Promise<UserIdentity | null>,
): RequestHandler => async (req, res, next) => {
  if (!req.authenticatedClerkId) {
    return res.status(401).json({ error: "Authentication required." });
  }

  try {
    const user = await findUserByClerkId(req.authenticatedClerkId);
    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }

    req.currentUserId = String(user._id);
    next();
  } catch (error) {
    next(error);
  }
};

export const requireCurrentUser = createRequireCurrentUser(
  async (clerkUserId) => User.findOne({ clerkId: clerkUserId }).select("_id"),
);

export const requireOwnUser: RequestHandler = (req, res, next) => {
  if (!req.currentUserId) {
    return res.status(401).json({ error: "Authentication required." });
  }

  const requestedUserIds = [
    req.params.userId,
    req.params.id,
    req.body?.userId,
  ].filter((id): id is string => typeof id === "string" && id.length > 0);

  if (requestedUserIds.some((id) => id !== req.currentUserId)) {
    return res.status(404).json({ error: "User not found." });
  }

  next();
};

export const getCurrentUserId = (req: Request): string => {
  if (!req.currentUserId) {
    throw new Error("Authenticated user context is missing.");
  }

  return req.currentUserId;
};
