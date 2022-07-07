import {
  processPlayContent,
  processPlayIndex,
} from "../lib/services/template/index.js";

export const prepare_environment = (data) => {
  processPlayContent(data);
  processPlayIndex(data);
};
