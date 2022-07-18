import { Log } from "../log/index.js";

const REPO_MAP = {
  play: "react_play_store",
  application: "react_play",
};

export const git_test_connection = (repo_name) => {
  const repo_link = get_repo_link(repo_name);
  Log.log(`Testing connection to ${repo_link}`);
};

export const git_clone_repo = (repo_name) => {
  const repo_link = get_repo_link(repo_name);
  Log.log(`Cloning repo ${repo_link}`);
};

export const git_pull_repo = (repo_name) => {
  const repo_link = get_repo_link(repo_name);
  Log.log(`Pulling repo ${repo_link}`);
};

export const git_fork_branch = (repo_name, branch_name = "main") => {
  const repo_link = get_repo_link(repo_name);
  Log.log(`Forking repo ${repo_link}/${branch_name}`);
};

const get_repo_link = (repo_name) => {
  return `git@github.com:reactplay/${REPO_MAP[repo_name]}.git`;
};
