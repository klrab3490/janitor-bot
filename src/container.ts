import { createDb } from "./database";
import { env } from "./config/env";
import { GuildRepository } from "./repositories/guildRepository";
import { ConnectionRepository } from "./repositories/connectionRepository";
import { PairingRepository } from "./repositories/pairingRepository";
import { EncryptionService } from "./services/encryptionService";
import { PairingService } from "./services/pairingService";
import { N8nService } from "./services/n8nService";

export async function createContainer() {
  const db = await createDb();

  const guildRepo = new GuildRepository(db);
  const connectionRepo = new ConnectionRepository(db);
  const pairingRepo = new PairingRepository(db);
  const encryptionService = new EncryptionService(env.ENCRYPTION_KEY);

  return {
    guildRepo,
    connectionRepo,
    pairingRepo,
    encryptionService,
    pairingService: new PairingService(pairingRepo, guildRepo),
    n8nService: new N8nService(connectionRepo, encryptionService),
  };
}

export type Container = Awaited<ReturnType<typeof createContainer>>;
