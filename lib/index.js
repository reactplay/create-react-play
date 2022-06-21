import { arg_objects } from "./arg-parser.js";
import { toKebabCase } from "../util/util.js";
import prompt from "prompt";
import { ALL_ARGS_TYPES } from "../util/const.js";

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

export const log = function (text) {
  console.log(text);
};

export const invoke_process = () => {
  const play_config = {
    issue: 0,
    issue_details: "",
    branch: "",
  };
  const arg_obj = arg_objects();
  if (arg_obj.error) {
    console.error(arg_obj.error_text);
  } else {
    arg_obj.args.forEach((element) => {
      switch (element.name) {
        case "create":
          console.log(`Preparing setup for ${element.value}`);
          console.log(`Cloning 'react-play'`);
          // TODO: Cloning 'react-play' code here
          prompt.start();
          prompt.get(properties, function (err, result) {
            if (err) {
              return onErr(err);
            }

            play_config.issue = result.issue;
            play_config.issue_details = result.issue_details;
            play_config.branch = `Issue-${play_config.issue}-${toKebabCase(
              play_config.issue_details
            )}`;
            console.log(`Forking branch ${play_config.branch}`);
            // TODO: Add forking code here
            console.log(`Forking success ${play_config.branch}`);
          });
          break;
        case "help":
          console.log(`Help instructions ---------------`);
          console.log("    Command: rpdk [-switch] [value]");
          console.log("             The list of arguments are");
          ALL_ARGS_TYPES.forEach((a) => {
            console.log(`             ${a.args}          ${a.description}`);
          });
          break;
      }
    });
  }
};
