#!/usr/bin/env node

import { invoke_process } from "../lib/index.js";
import { CONSOLE_COLORS } from "../util/const.js";

// Displays the text in the console

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
  " |                       React Play Development Kit                        |"
);
console.log(
  " |                                                                         |"
);
console.log(
  " |                       For help hit : rpdk -h/help                       |"
);
console.log(
  " └─────────────────────────────────────────────────────────────────────────┘"
);

console.log(CONSOLE_COLORS.Reset, "");
invoke_process();
