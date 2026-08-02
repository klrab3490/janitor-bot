import { test } from "node:test";
import assert from "node:assert/strict";
import { PairingService } from "./pairingService";
import type { PairingRepository } from "../repositories/pairingRepository";
import type { GuildRepository } from "../repositories/guildRepository";
import type { PairingRecord } from "../models";

function fakeRepos() {
  const pairings = new Map<string, PairingRecord>();

  const pairingRepo = {
    async create(code: string, guildId: string, expiresAt: string) {
      pairings.set(code, { code, guild_id: guildId, expires_at: expiresAt, created_at: new Date().toISOString() });
    },
    async findValidByCode(code: string) {
      const pairing = pairings.get(code);
      if (!pairing || pairing.expires_at <= new Date().toISOString()) return undefined;
      return pairing;
    },
    async deleteByGuildId(guildId: string) {
      for (const [code, pairing] of pairings) if (pairing.guild_id === guildId) pairings.delete(code);
    },
    async deleteExpired() {
      const now = new Date().toISOString();
      for (const [code, pairing] of pairings) if (pairing.expires_at <= now) pairings.delete(code);
    },
  } as unknown as PairingRepository;

  const guildRepo = { async upsert() {} } as unknown as GuildRepository;

  return { pairingRepo, guildRepo };
}

test("createPairing generates an AAAA-AAAA formatted code redeemable exactly once", async () => {
  const { pairingRepo, guildRepo } = fakeRepos();
  const service = new PairingService(pairingRepo, guildRepo);

  const { code } = await service.createPairing("guild-1", "Test Guild");
  assert.match(code, /^[A-Z0-9]{4}-[A-Z0-9]{4}$/);

  const guildId = await service.consumePairing(code);
  assert.equal(guildId, "guild-1");

  const secondAttempt = await service.consumePairing(code);
  assert.equal(secondAttempt, null);
});

test("consumePairing rejects unknown codes", async () => {
  const { pairingRepo, guildRepo } = fakeRepos();
  const service = new PairingService(pairingRepo, guildRepo);
  assert.equal(await service.consumePairing("NOPE-NOPE"), null);
});
