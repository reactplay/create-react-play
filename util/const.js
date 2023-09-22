export const CONSOLE_COLORS = {
  Reset: '\x1b[0m',
  Bright: '\x1b[1m',
  Dim: '\x1b[2m',
  Underscore: '\x1b[4m',
  Blink: '\x1b[5m',
  Reverse: '\x1b[7m',
  Hidden: '\x1b[8m',

  FgBlack: '\x1b[30m',
  FgRed: '\x1b[31m',
  FgGreen: '\x1b[32m',
  FgYellow: '\x1b[33m',
  FgBlue: '\x1b[34m',
  FgMagenta: '\x1b[35m',
  FgCyan: '\x1b[36m',
  FgWhite: '\x1b[37m',

  BgBlack: '\x1b[40m',
  BgRed: '\x1b[41m',
  BgGreen: '\x1b[42m',
  BgYellow: '\x1b[43m',
  BgBlue: '\x1b[44m',
  BgMagenta: '\x1b[45m',
  BgCyan: '\x1b[46m',
  BgWhite: '\x1b[47m'
};

export const ALL_ARGS_TYPES = [
  {
    name: 'create',
    args: ['create', '-c'],
    description: 'Create a play',
    flag: false
  },
  {
    name: 'update',
    args: ['update', '-u'],
    description: 'Update a play',
    flag: false
  },
  {
    name: 'prepare',
    args: ['prepare', '-p'],
    description: 'Prepare environment for build',
    flag: true
  },
  {
    name: 'help',
    args: ['help', '-h'],
    description: 'Print all available commands',
    flag: true
  },
  {
    name: 'playspath',
    args: ['-plays'],
    description: 'Define a custom path for the plays',
    flag: true
  },
  {
    name: 'images',
    args: ['-i'],
    description: 'Create small thumbsnail of image and correct bad extension',
    flag: true
  }
];

let playsPath = './src/plays';

let customPath = process.argv.find((arg) => arg.includes('-plays='));
if (customPath !== undefined) {
  playsPath = './' + customPath.slice(7);
}


export const BUILD_IMAGES = process.argv.find((arg) => arg.includes('-i=')) !== undefined;
export const IMAGE_SMALL_SIZE = 260;
export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
export const IMAGE_QUALITY_CONVERSION = 80;

export const DIRECTORIES = {
  PLAY: playsPath,
  E2E: './cypress/e2e'
};
