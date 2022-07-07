let node = "CRP";
const log = (text, ignoreHeader = false) => {
  console.log(`     ${ignoreHeader ? "" : `${getDate()}: ${node} : `} ${text}`);
};

const header = (text) => {
  newLine();
  console.log(`>> ${text}`);
};

const highlight = (text) => {
  console.log("---------------------------------------------------------");
  console.log(`     ${text}`);
  console.log("---------------------------------------------------------");
};

const segementStart = (text) => {
  console.log(`----------------- Start: ${text}-----------------------`);
};
const segementEnd = (text) => {
  console.log(`----------------- Start: ${text}-----------------------`);
};

const newLine = (text) => {
  console.log(``);
};

const getDate = () => {
  return new Date().toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const Log = {
  log,
  header,
  highlight,
  segementEnd,
  segementStart,
  newLine,
  node,
};
