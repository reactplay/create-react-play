import { ALL_ARGS_TYPES } from "../util/const.js";

export const arg_objects = () => {
  const res = { args: [], error: false, error_text: "" };
  const all_args = process.argv.slice(2);
  const skip_indexes = [];
  try {
    all_args.forEach((arg_input, arg_index) => {
      if (skip_indexes.indexOf(arg_index) === -1) {
        ALL_ARGS_TYPES.forEach((arg_type) => {
          arg_type.args.forEach((arg_name) => {
            if (arg_input.toLowerCase() === arg_name) {
              if (!arg_type.flag) {
                res.args.push({
                  name: arg_type.name,
                  value: all_args[arg_index + 1],
                });
                skip_indexes.push(arg_index);
              } else {
                res.args.push({ name: arg_type.name, flag: true });
              }
            }
          });
        });
      }
    });
  } catch (error) {
    res.error = true;
    res.error_text = error;
  }
  return res;
};
