/**
 * cPanel Node.js / Passenger entry.
 * Application startup file → server.js
 */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "127.0.0.1";

const app = next({
  dev: false,
  hostname,
  port,
  dir: __dirname,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, hostname, () => {
      console.log(`PullUp listening on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start PullUp", err);
    process.exit(1);
  });
