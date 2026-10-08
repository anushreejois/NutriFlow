import assert from "node:assert/strict";
import { Server } from "node:http";
import { AddressInfo } from "node:net";
import { afterEach, describe, it } from "node:test";
import express from "express";
import {
  createRequireClerkAuth,
  createRequireCurrentUser,
  getCurrentUserId,
  requireOwnUser,
} from "../src/middleware/auth";

describe("API authentication and ownership middleware", () => {
  let server: Server | undefined;
  let baseUrl: string;

  const startTestServer = async (clerkUserId: string | null) => {
    const app = express();
    app.use(express.json());
    app.post(
      "/private-resource",
      createRequireClerkAuth(() => clerkUserId),
      createRequireCurrentUser(async (id) =>
        id === "clerk-user" ? { _id: "database-user" } : null,
      ),
      requireOwnUser,
      (req, res) => res.json({ ownerId: getCurrentUserId(req) }),
    );

    const testServer = app.listen(0, "127.0.0.1");
    server = testServer;
    await new Promise<void>((resolve) => testServer.once("listening", resolve));
    const { port } = testServer.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
  };

  const stopTestServer = async () => {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
      server = undefined;
    }
  };
  afterEach(stopTestServer);

  it("rejects requests without a verified Clerk identity", async () => {
    await startTestServer(null);

    const response = await fetch(`${baseUrl}/private-resource`, { method: "POST" });
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: "Authentication required." });
  });

  it("rejects attempts to access another user's record", async () => {
    await startTestServer("clerk-user");

    const response = await fetch(`${baseUrl}/private-resource`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: "another-database-user" }),
    });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: "User not found." });
  });

  it("rejects authenticated identities without an application profile", async () => {
    await startTestServer("unlinked-clerk-user");

    const response = await fetch(`${baseUrl}/private-resource`, { method: "POST" });
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: "User profile not found." });
  });

  it("uses the authenticated user's database identity for owned requests", async () => {
    await startTestServer("clerk-user");

    const response = await fetch(`${baseUrl}/private-resource`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId: "database-user" }),
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ownerId: "database-user" });
  });
});
