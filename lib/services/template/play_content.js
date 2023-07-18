import fs from "fs";
import * as path from "path";
import { replaceAll, toSanitized, toSlug } from "../../../util/string.js";
import { fileURLToPath } from "url";
import { Log } from "../../../log/index.js";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const PLAY_LIST_DIRECTORY = "./src/plays";
const TEMPLATE_DIRECTORY = "_templates";

const TEMPLATE_MAP = {
  common: ["Readme_md"],
  js: ["component_jsx"],
  ts: ["component_tsx"],
  css: ["styles_css"],
  scss: ["styles_scss"],
};

export const processPlayContent = (play) => {
  const play_directory = createPlayDirectory(play);
  processTemplates(play, play_directory);
};

const createPlayDirectory = (play) => {
  const play_directory = `${PLAY_LIST_DIRECTORY}/${toSlug(play.kebab_name)}`;
  if (!fs.existsSync(play_directory)) {
    fs.mkdirSync(play_directory, { recursive: true });
  }
  return play_directory;
};

const processTemplates = (data, play_path) => {
  processTemplate(data, "common", play_path);
  processTemplate(data, data.language, play_path);
  processTemplate(data, data.style || "css", play_path);
};

const replaceTemplateVar = (play_data, filePath) => {
  fs.readFile(filePath, "utf8", function (err, data) {
    if (err) {
      return Log.log(err);
    }
    let updated_result = data;
    Object.keys(play_data).forEach((key) => {
      updated_result = replaceAll(
        updated_result,
        `%PLAY_${key.toUpperCase()}%`,
        play_data[key]
      );
    });
    fs.writeFile(filePath, updated_result, "utf8", function (err) {
      if (err) return Log.log(`Error: During file write: ${err}, ${play_data}`);
    });
  });
};

const getTargetFileName = (source_file_name) => {
  // e.g: component_js.tmpl
  const source_file_name_ext_index = source_file_name.lastIndexOf("."); // ['component_js','tmpl']
  const file_name_wo_ext = source_file_name.substring(
    0,
    source_file_name_ext_index
  ); // 'component_js'

  const source_file_name_segment = file_name_wo_ext.split("_"); // ['component', 'js']
  const new_file_ext =
    source_file_name_segment[source_file_name_segment.length - 1]; // 'js'
  source_file_name_segment.splice(-1, 1); // ['component']
  const new_file_name_wo_ext = source_file_name_segment.join(""); // 'component'

  const target_file_name = `${new_file_name_wo_ext}.${new_file_ext}`;
  return target_file_name;
};

const processTemplate = (play, template_type, play_path) => {
  TEMPLATE_MAP[template_type].forEach(async (file) => {
    const file_name = `${file}.tmpl`;
    let target_template_name = file_name;
    if (template_type === "js" || template_type === "ts") {
      target_template_name = target_template_name.replace(
        "component",
        toSanitized(play.title_name)
      );
    }
    const file_path = path.resolve(__dirname, TEMPLATE_DIRECTORY, file_name);
    const target_path = `${play_path}/${getTargetFileName(
      target_template_name
    )}`;
    await fs.copyFile(
      file_path,
      target_path,
      (res) => {
        replaceTemplateVar(play, target_path);
      },
      (err) => {
        console.error(err);
      }
    );
  });
};
