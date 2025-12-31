import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

export function getCacheBaseDir(): string {
  return (
    process.env.PHONICS_CACHE_DIR ?? path.join(process.cwd(), ".phonics-cache")
  );
}

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function readFileIfExists(
  filePath: string
): Promise<Buffer | null> {
  try {
    return await fs.readFile(filePath);
  } catch (error: any) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

export async function readJsonIfExists<T>(filePath: string): Promise<T | null> {
  const file = await readFileIfExists(filePath);
  if (!file) return null;
  try {
    return JSON.parse(file.toString("utf8")) as T;
  } catch {
    return null;
  }
}

export async function writeFileAtomic(
  filePath: string,
  data: Buffer | string
): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  const tmpPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  await fs.writeFile(tmpPath, data);

  let renamed = false;
  try {
    await fs.rename(tmpPath, filePath);
    renamed = true;
  } catch (error: any) {
    if (error?.code === "EEXIST" || error?.code === "EPERM") {
      await fs.rm(filePath, { force: true });
      await fs.rename(tmpPath, filePath);
      renamed = true;
      return;
    }
    throw error;
  } finally {
    if (!renamed) {
      await fs.rm(tmpPath, { force: true });
    }
  }
}

export async function writeJsonAtomic(
  filePath: string,
  value: unknown
): Promise<void> {
  await writeFileAtomic(filePath, JSON.stringify(value));
}
