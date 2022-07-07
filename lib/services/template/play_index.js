import fs from "fs";
import { Log } from "../../../log/index.js";
import { DIRECTORIES } from "../../../util/const.js";
import { isValidString } from "../../../util/string.js";
import { loadAllPlaysAsync } from "../datasource/index.js";

const INDEX_FILE_PATH = `${DIRECTORIES.PLAY}/index.js`;
export const processPlayIndex = (play) => {
  loadAllPlaysAsync().then((plays) => {
    const all_dirs = getAllPlaysLocally();
    writeFile(plays, all_dirs);
  });
};

const getAllPlaysLocally = () => {
  const all_files = fs.readdirSync("./src/plays");
  return all_files;
};

const writeFile = (plays, dirs) => {
  fs.writeFileSync(
    INDEX_FILE_PATH,
    "// Do not modify the content of this file"
  );
  plays.forEach((play) => {
    if (dirs.indexOf(play.kebab_name) > -1) {
      Log.log(`Play found locally : ${play.kebab_name}`);
      fs.appendFileSync(
        INDEX_FILE_PATH,
        `\n export { default as ${
          isValidString(play.component) || play.pascal_name
        } } from 'plays/${play.kebab_name}/${
          isValidString(play.component) || play.kebab_name
        }';`
      );
    }
  });
};
