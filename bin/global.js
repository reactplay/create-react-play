#!/usr/bin/env node

import { invoke_process } from "../lib/index.js";
import { CONSOLE_COLORS } from "../util/const.js";
import fs from "fs";
// import * as meta from "";

// Displays the text in the console
let meta = JSON.parse(fs.readFileSync("package.json", "utf-8"));
console.log(
  CONSOLE_COLORS.FgGreen,
  "┌─────────────────────────────────────────────────────────────────────────┐"
);
console.log(
  " |                                                                         |"
);
console.log(
  " |                               Welcome to                                |"
);
console.log(
  ` |                      Create Rect Play (v ${meta.version})                         |`
);
console.log(
  " |                                                                         |"
);
console.log(
  " |                 For help hit : create-react-play -h/help                |"
);
console.log(
  " └─────────────────────────────────────────────────────────────────────────┘"
);

console.log(CONSOLE_COLORS.Reset, "");
invoke_process();
