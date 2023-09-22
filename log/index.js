let node = 'CRP';
const log = (text, ignoreHeader = false, node = 'INFO') => {
  console.log(`     ${node} : ${ignoreHeader ? '' : `${getDate()}: ${node} : `} ${text}`);
};

const error = (text, ignoreHeader = false, node = 'ERROR') => {
  console.error(`     ${node} : ${ignoreHeader ? '' : `${getDate()}: ${node} : `} ${text}`);
};

const warning = (text, ignoreHeader = false) => {
  log(text, ignoreHeader, 'WARNING');
};

const header = (text) => {
  newLine();
  console.log(`>> ${text}`);
};

const highlight = (text) => {
  console.log('---------------------------------------------------------');
  console.log(`     ${text}`);
  console.log('---------------------------------------------------------');
};

const segementStart = (text) => {
  console.log(`----------------- Start: ${text}-----------------------`);
  console.log('');
};
const segementEnd = (text) => {
  console.log('');
  console.log(`----------------- End: ${text}-----------------------`);
  console.log('');
};

const newLine = (text) => {
  console.log(``);
};

const getDate = () => {
  return new Date().toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const Log = {
  log,
  warning,
  error,
  header,
  highlight,
  segementEnd,
  segementStart,
  newLine,
  node
};
