import fs from "fs";
import { Log } from "../../../log/index.js";
import { DIRECTORIES } from "../../../util/const.js";
import { isValidString } from "../../../util/string.js";
import { loadAllPlaysAsync } from "../datasource/index.js";

const INDEX_FILE_PATH = `${DIRECTORIES.PLAY}/index.js`;
export const processPlayIndex = () => {
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
    let playPath = play.kebab_name;
    if (play.path) {
      const pathSegmentation = play.path.split("/");
      if (pathSegmentation.length > 1 && play.dev_mode !== true) {
        playPath = pathSegmentation[2];
        if (playPath !== play.kebab_name) {
          Log.log(
            `Play name and path is not matching : ${play.name}(${playPath})`
          );
        }
      }
    }
    Log.log(`Checking play locally: ${play.name}(${playPath})`);
    if (dirs.indexOf(playPath) > -1) {
      Log.log(`Play found locally : ${playPath}`);
      fs.appendFileSync(
        INDEX_FILE_PATH,
        `\n export { default as ${
          isValidString(play.component) || play.title_name
        } } from 'plays/${playPath}/${
          isValidString(play.component) || play.title_name || play.kebab_name
        }';`
      );
    } else {
      Log.warning(`Play not found locally : ${play.name}(${playPath})`);
    }
  });
};
