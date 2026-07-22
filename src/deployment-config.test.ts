import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

describe("public deployment configuration", () => {
  it("pins the BFF to one Frankfurt function region", async () => {
    const config = JSON.parse(await readFile("vercel.json", "utf8")) as {
      framework?: string;
      regions?: string[];
    };

    expect(config.framework).toBe("nextjs");
    expect(config.regions).toEqual(["fra1"]);
  });

  it("keeps the backend origin server-only and documents the public warning", async () => {
    const [exampleEnv, runbook] = await Promise.all([
      readFile(".env.example", "utf8"),
      readFile("docs/deployment.md", "utf8"),
    ]);
    const normalizedRunbook = runbook.replace(/\s+/g, " ");

    expect(exampleEnv).toContain("API_BASE_URL=");
    expect(exampleEnv).not.toMatch(/NEXT_PUBLIC_.*API/);
    expect(normalizedRunbook).toContain(
      "Demo only. Do not enter real financial or sensitive information. Demo data may be reset.",
    );
    expect(normalizedRunbook).toContain("Do not configure `DEEPSEEK_API_KEY`");
    expect(normalizedRunbook).toContain("not a production SLA");
  });
});
