import { exec } from "child_process";

export const basic_get_package_manager = () => {
  console.log("Checking package manager");
  return "yarn";
};

export const basic_check_shell_connectivity = () => {
  console.log("Checking shell connectivity");
  exec("sh ./scripts/sample.sh", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};
