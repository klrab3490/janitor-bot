import { test } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { EncryptionService } from "./encryptionService";

test("encrypt/decrypt round-trips a plaintext value", () => {
  const service = new EncryptionService(randomBytes(32).toString("hex"));
  const ciphertext = service.encrypt("super-secret-api-key");

  assert.notEqual(ciphertext, "super-secret-api-key");
  assert.equal(service.decrypt(ciphertext), "super-secret-api-key");
});

test("decrypt throws on malformed input", () => {
  const service = new EncryptionService(randomBytes(32).toString("hex"));
  assert.throws(() => service.decrypt("not-a-valid-payload"));
});

test("decrypt fails with the wrong key", () => {
  const a = new EncryptionService(randomBytes(32).toString("hex"));
  const b = new EncryptionService(randomBytes(32).toString("hex"));
  const ciphertext = a.encrypt("secret");
  assert.throws(() => b.decrypt(ciphertext));
});
