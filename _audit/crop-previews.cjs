// Trim only near-white outer margins; leave the full diagram intact.
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require(process.env.SHARP_MODULE || "sharp");

(async () => {
  const directory = path.join(__dirname, "../assets/img/publication_preview");
  for (const name of ["catch.png", "ddtsr.png", "mmapis.png", "usp.png", "saslm.jpg"]) {
    const target = path.join(directory, name);
    const source = await fs.readFile(target);
    const before = await sharp(source).metadata();
    const cropped = await sharp(source).trim({ background: "#ffffff", threshold: 1 }).png().toBuffer({ resolveWithObject: true });
    if (cropped.info.width === before.width && cropped.info.height === before.height) {
      console.log(name, "already tightly cropped");
      continue;
    }
    let output = sharp(cropped.data).extend({ top: 4, bottom: 4, left: 4, right: 4, background: "#ffffff" });
    output = name.endsWith(".jpg") ? output.jpeg({ quality: 95 }) : output.png({ compressionLevel: 9 });
    const result = await output.toBuffer({ resolveWithObject: true });
    await fs.writeFile(target, result.data);
    console.log(name, before.width, before.height, "→", result.info.width, result.info.height);
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
