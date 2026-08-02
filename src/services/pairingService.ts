import { randomInt } from "node:crypto";
import type { PairingRepository } from "../repositories/pairingRepository";
import type { GuildRepository } from "../repositories/guildRepository";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous I/O/0/1
const PAIRING_TTL_MS = 10 * 60 * 1000;

function generateCode(): string {
  const part = () => Array.from({ length: 4 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");
  return `${part()}-${part()}`;
}

export class PairingService {
  constructor(
    private readonly pairingRepo: PairingRepository,
    private readonly guildRepo: GuildRepository
  ) {}

  async createPairing(guildId: string, guildName: string): Promise<{ code: string; expiresAt: Date }> {
    await this.guildRepo.upsert(guildId, guildName);
    await this.pairingRepo.deleteExpired();

    const code = generateCode();
    const expiresAt = new Date(Date.now() + PAIRING_TTL_MS);
    await this.pairingRepo.create(code, guildId, expiresAt.toISOString());
    return { code, expiresAt };
  }

  /** Returns the guildId the code was issued for, or null if invalid/expired. */
  async consumePairing(code: string): Promise<string | null> {
    const pairing = await this.pairingRepo.findValidByCode(code);
    if (!pairing) return null;
    await this.pairingRepo.deleteByGuildId(pairing.guild_id);
    return pairing.guild_id;
  }
}
