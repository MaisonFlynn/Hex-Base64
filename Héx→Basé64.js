require("fs").writeFileSync(
  "I∕O.txt",
  (() => {
    const Hex = require("fs")
      .readFileSync("I∕O.txt", "utf8")
      .replace(/[^0-9a-fA-F]/g, "");
    if (!Hex || Hex.length % 2) process.exit(1);
    const Base64 = Buffer.from(Hex, "hex")
      .toString("base64")
      .replace(/\+/g, "!")
      .replace(/\//g, "?")
      .replace(/=/g, "");
    return Array.from({ length: 14 }, (_, i) =>
      (Base64.slice(i * 8, i * 8 + 8) || "").padEnd(8, "A")
    ).join("\n");
  })()
);
