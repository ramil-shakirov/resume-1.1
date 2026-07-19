// Copies backend/resume.json (source of truth) into webapp/model/resume.json
// (what the running app actually fetches). Run after editing backend/resume.json,
// then `npm start` to preview locally. CI runs this same copy automatically on deploy.
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "..", "backend", "resume.json");
const dest = path.join(__dirname, "..", "webapp", "model", "resume.json");

fs.copyFileSync(src, dest);
console.log("Synced " + src + " -> " + dest);
