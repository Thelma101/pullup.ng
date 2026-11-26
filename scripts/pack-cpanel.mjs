/**
 * Builds a zip ready to upload to shared cPanel (Node.js App).
 * Run: npm run pack:cpanel
 */
import { execSync } from "child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createWriteStream } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outDir = join(root, "dist-cpanel", "gopullup");
const zipPath = join(root, "dist-cpanel", "gopullup-cpanel.zip");

const SKIP = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist-cpanel",
  "email-previews",
  "data",
  ".env.local",
  ".env",
  ".DS_Store",
]);

function shouldSkip(name) {
  if (SKIP.has(name)) return true;
  if (name.startsWith(".env") && name !== ".env.example" && name !== ".env.production.example") {
    return true;
  }
  return false;
}

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    if (shouldSkip(name)) continue;
    const from = join(src, name);
    const to = join(dest, name);
    const st = statSync(from);
    if (st.isDirectory()) copyTree(from, to);
    else cpSync(from, to);
  }
}

async function zipDir(sourceDir, outZip) {
  if (process.platform === "win32") {
    const ps = `Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${outZip}' -Force`;
    execSync(`powershell -NoProfile -Command "${ps}"`, { stdio: "inherit" });
    return;
  }
  const parent = dirname(sourceDir);
  const base = sourceDir.split(/[/\\]/).pop();
  execSync(`zip -r "${outZip}" "${base}"`, { cwd: parent, stdio: "inherit", shell: true });
}

console.log("Cleaning dist-cpanel…");
rmSync(join(root, "dist-cpanel"), { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

console.log("Copying project files (no secrets / no node_modules)…");
copyTree(root, outDir);

cpSync(join(root, ".env.production.example"), join(outDir, ".env.example"));

writeFileSync(
  join(outDir, "UPLOAD-README.txt"),
  `PullUp — cPanel upload package
================================

1. In cPanel → Setup Node.js App → Create Application
   - Node version: 20.x (or 18+)
   - Application root: folder where you unzip this (e.g. gopullup)
   - Application URL: gopullup.ng (or subdomain)
   - Application startup file: server.js
   - Application mode: Production

2. Upload & unzip this package into the application root.

3. Set environment variables (cPanel Node UI or .env):
   Copy from .env.example — fill Paystack, MongoDB URI, Resend, OPS secret.
   NEXT_PUBLIC_SITE_URL=https://gopullup.ng
   EMAIL_FROM=PullUp <hello@gopullup.ng>

4. In the Node app terminal / SSH:
   npm install --omit=dev
   npm run build

5. Restart the Node application in cPanel.

6. Resend: add gopullup.ng in Resend → Domains, paste DNS in cPanel Zone Editor,
   then create API key and set RESEND_API_KEY.

7. MongoDB Atlas: Network Access → allow your hosting IP (or 0.0.0.0/0 for shared).
   Paste the FULL connection string (not CLUSTER placeholder).

8. Paystack: set callback / site URL to https://gopullup.ng

Test: https://gopullup.ng  and  https://gopullup.ng/api/health
Ops:  https://gopullup.ng/ops
`,
  "utf8",
);

if (existsSync(zipPath)) rmSync(zipPath);
console.log("Zipping…");
await zipDir(outDir, zipPath);

console.log("\nDone.");
console.log(`Folder: ${outDir}`);
console.log(`Zip:    ${zipPath}`);
console.log("Upload the zip to cPanel File Manager and extract into your Node app root.");
