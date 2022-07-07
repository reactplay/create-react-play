import { arg_objects } from "./arg-parser.js";
import { toKebabCase } from "../util/util.js";
import prompt from "prompt";
import { ALL_ARGS_TYPES } from "../util/const.js";
import * as hooks from "../hooks/index.js";
import { Log } from "../log/index.js";

const properties = [
  {
    name: "issue",
    description: "Enter issue number",
    validator: /^[0-9]*$/,
    warning: "Issue can only be numbers",
  },
  {
    name: "issue_details",
    description: "Enter issue details (max 5 words)",
    validator: /^[a-zA-Z0-9]{1,5}$/,
    warning: "Maximum length can be five words",
  },
];

export const invoke_process = async () => {
  // hooks.basic_check_shell_connectivity();
  // Step 1: Sanity check
  Log.header("Checking github connectivity");
  hooks.git_test_connection("application");
  hooks.git_test_connection("play");
  // Step 1.1: Is the user logged in to GHU?
  // Step 1.1.1: If not, return error and ask to login.
  Log.header("Checking package manager availability");
  hooks.basic_get_package_manager();
  // Step 1.2: Is yarn/npm installed?
  // Step 1.2.1: If not, return error and ask to login.
  const play_config = {
    issue: 320,
    issue_details: "create-ludo-play",
    branch: "",
  };
  const arg_obj = arg_objects();
  if (arg_obj.error) {
    console.error(arg_obj.error_text);
  } else {
    if (arg_obj.args.length) {
      arg_obj.args.forEach(async (element) => {
        switch (element.name) {
          case "create":
            Log.header("Reading play information");

            // Step 2: Read play store
            // Step 2.1: Read play master information
            const play_data = await hooks.data_read_play_by_id(element);
            hooks.prepare_environment(play_data);
            // Step 2.2: Read temp table to retrieve play information
            // hooks.data_read_table("play_temp");
            // console.log(`> Preparing setup for <play_name>`);
            // console.log(`> Cloning/updating 'react-play'`);
            // hooks.git_clone_repo("application");
            // // Step 3: Check whether current directory has got .git folder and remote branch is react-play/master
            // console.log("Updating local with remote branch");
            // // Step 3.1: If yes, then make a `git pull`
            // // Step 3.2: If No, then make a `git clone`
            // console.log(`Cloning/updating 'react-play-store'`);
            // hooks.git_clone_repo("play");
            // // Step 4: Check whether src/play  directory has got .git folder and remote branch is react-play-store/master
            // // Step 4.1: If yes, then make git pull
            // console.log(`Retrieving current play configuration`);
            // // Step 5.1.1: Get all play data from master table
            // console.log("Preparing all plays");
            // // Step 5.1.2: Update .gitignore file accordingly
            // // prompt.start();
            // // prompt.get(properties, function (err, result) {
            // //   if (err) {
            // //     return onErr(err);
            // //   }

            // //   play_config.issue = result.issue;
            // //   play_config.issue_details = result.issue_details;
            // //   play_config.branch = `Issue-${play_config.issue}-${toKebabCase(
            // //     play_config.issue_details
            // //   )}`;

            // // });
            // if (!play_config.branch) {
            //   play_config.branch = `Issue-${play_config.issue}-${toKebabCase(
            //     play_config.issue_details
            //   )}`;
            // }
            // console.log(`> Forking branch ${play_config.branch}`);
            // hooks.git_fork_branch("play");
            // // Step 6: Fork into users repo
            // console.log(`Forking success ${play_config.branch}`);
            // // Step 7: Call yarn/npm install on container application
            // console.log("Installing dependency. It may take upto few minutes");
            // // Step 7.1: Call yarn/npm install for each of the play
            // console.log("> Starting the application");
            // // Step 8: yarn/npm start
            break;
          case "help":
            Log.newLine();
            Log.segementStart(`Help instructions`);
            Log.log("Command: create-react-play [-switch] [value]", true);
            Log.log("             The list of arguments are", true);
            ALL_ARGS_TYPES.forEach((a) => {
              Log.log(`             ${a.args}          ${a.description}`, true);
            });
            Log.segementEnd(`Help instructions`);
            break;
        }
      });
    } else {
      Log.highlight(
        "Welcome to create-react-play. For more information check help flag"
      );
    }
  }
};
