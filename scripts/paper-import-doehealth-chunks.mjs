#!/usr/bin/env node
/** Print JSON lines { targetNodeId, html } for Paper write_html imports. */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "scripts", "paper-dumps");
const read = (name) => readFileSync(join(dir, name), "utf8");

const chunks = [
  { name: "banner", html: read("doehealth-part-0.html").replaceAll("position:fixed", "position:absolute") },
  { name: "nav", html: read("doehealth-part-1.html") },
  {
    name: "hero-stack-open",
    html: '<div layer-name="Hero stack" style="display:flex;flex-direction:column;flex:1 1 auto;position:relative;min-height:0;width:100%;overflow:hidden;background-color:#1A1208;">',
  },
  { name: "shader", html: read("doehealth-part-2.html") },
  { name: "orb-prefix", html: read("doehealth-orb-prefix.html") },
  ...readdirSync(dir)
    .filter((f) => /^doehealth-orb-\d+\.html$/.test(f))
    .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0])
    .map((f) => ({ name: f, html: read(f) })),
  { name: "orb-suffix", html: read("doehealth-orb-suffix.html") },
  { name: "hero-copy", html: read("doehealth-part-4.html") },
  { name: "hero-stack-close", html: "</div>" },
];

for (const c of chunks) {
  process.stdout.write(JSON.stringify({ name: c.name, len: c.html.length }) + "\n");
}
