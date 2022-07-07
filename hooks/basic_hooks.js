import { exec } from "child_process";
import { Log } from "../log/index.js";

export const basic_get_package_manager = () => {
  Log.log("Checking package manager");
  return "yarn";
};

export const basic_check_shell_connectivity = () => {
  Log.log("Checking shell connectivity");
  Log.log(process.cwd());
  exec(
    `sh ${process.cwd()}\\react-play-dev-kit\\scripts\\sample.sh`,
    (error, stdout, stderr) => {
      if (error) {
        Log.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        Log.log(`stderr: ${stderr}`);
        return;
      }
      Log.log(`stdout: ${stdout}`);
    }
  );
};
