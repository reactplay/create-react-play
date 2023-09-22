import fs from 'fs';
import { Log } from '../../../log/index.js';

import {
  IMAGE_EXTENSIONS,
  IMAGE_SMALL_SIZE,
  IMAGE_QUALITY_CONVERSION,
  DIRECTORIES,
  BUILD_IMAGES
} from '../../../util/const.js';

import { isValidString, toSanitized, toSlug } from '../../../util/string.js';
import { loadAllPlaysAsync } from '../datasource/index.js';

import { processTemplate } from './play_content.js';

import axios from 'axios';
import { fileTypeFromFile, fileTypeFromBuffer } from 'file-type';
import Jimp from 'jimp';
import webp from 'webp-converter';

const INDEX_FILE_PATH = `${DIRECTORIES.PLAY}/index.js`;
const INDEX_JSON_FILE_PATH = `${DIRECTORIES.PLAY}/index.json`;

// this will grant 755 permission to webp executables
webp.grant_permission();

// Check if scr/plays exists for backward compatibilities
let isPmpmWorkspace = fs.existsSync('./pnpm-workspace.yaml');

/**
 * @desc Download the cover from an url
 * @params { string } url the url of the cover image
 * @params { string } playPath the path for the play directory
 */
// function downloadCover(url, playPath) {
// let fileType = null;
// try {
// (async () => {
// const res = await axios.get(url, { responseType: 'arraybuffer' });
// fileType = await fileTypeFromBuffer(res.data);
// fs.writeFileSync(`${playPath}/cover.${fileType.ext}`, res.data);
// })();
// } catch (error) {
// Log.log(`${playPath}`);
// Log.error(error)
// }
// }

/**
 * @desc Copy image files from a source directory to another destination
 * with a filename provided
 * @params { string } srcFolder the source folder
 * @params { string } destFolder the destination folder
 * @params { string } filename the name of the file to copy
 * @return void
 */
async function copyImages(srcFolder, destFolder, filename) {
  try {
    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder);
    }
  } catch (err) {
    Log.error(error);
  }

  let timeout = 0;
  if (!fs.existsSync(`${srcFolder}/${filename}`)) {
    timeout = 1000;
  }

  setTimeout(() => {
    if (fs.existsSync(`${srcFolder}/${filename}`)) {
      const filePath = `${srcFolder}/${filename}`;
      const copy = `${destFolder}/${filename}`;
      fs.copyFile(filePath, copy, (error) => {
        if (error) {
          Log.log(error);
        } else {
          Log.log(`Copy of ${filename} done!`);
        }
      });
    }
  }, timeout);
}

/**
 * Check an image file named cover in the directory and return a string as file extension
 * @params { string } playPath : path of the play in the plays directory
 * @return { string } the extension of the file or empty string
 */
const getPlayCoverExtension = (playPath) => {
  let extension = IMAGE_EXTENSIONS.reduce((ext, nextExt) => {
    if (ext === '' && fs.existsSync(`${DIRECTORIES.PLAY}/${playPath}/cover.${nextExt}`)) {
      return nextExt;
    }
    return ext;
  }, '');
  return extension ?? '';
};

/**
 * @desc get an extension for an image and check if
 * the extension has the correct type. If not, rename the file with
 * the correct extension
 * @params { string } playDir the plays directory
 * @params { string } playPath the path of the directory ( name + slug)
 * @params { string } currentExtension the extension to check
 * @return void
 */
async function cleanUpFileExtension(playDir, playPath) {
  const currentExtension = getPlayCoverExtension(playPath);

  if (currentExtension) {
    const type = await fileTypeFromFile(`${playDir}/${playPath}/cover.${currentExtension}`);
    if (type.ext !== currentExtension) {
      fs.renameSync(
        `${playDir}/${playPath}/cover.${currentExtension}`,
        `${playDir}/${playPath}/cover.${type.ext}`
      );
    }
  }
}

/**
 * @desc Resize a provided image and create a webp version of it
 * if the image is already a webp image, only resize will be done
 * @params { string } playsDir the directory with the plays
 * @params { string } playPath the path to the folder source of the image
 * @params { string } coverFileExtension the extension of the image
 */
async function resizeAndCreateWebp(playsDir, playPath, coverFileExtension) {
  if (fs.existsSync(`${playsDir}/${playPath}/cover.${coverFileExtension}`)) {
    await resizeImages(
      `${playsDir}/${playPath}`,
      `cover.${coverFileExtension}`,
      'cover',
      coverFileExtension
    )
      .then(async (result) => {
        await convertToWebp(`${playsDir}/${playPath}`, 'cover', coverFileExtension);
        return true;
      })
      .catch((error) => {
        Log.error(error);
      });
  }
}

/**
 * @desc Convert an image to the webp extension.
 * and create a smaller version based on the IMAGE_SMALL_SIZE variable
 * @params { string } filePath the path to the image
 * @params { string } file the name of file, default : cover
 * @params { string } the extension of the file provided
 * @return Promise
 */
const convertToWebp = async (filePath, file = 'cover', originExtension) => {
  return new Promise((resolve) => {
    if (originExtension !== 'webp') {
      webp.cwebp(
        `${filePath}/${file}.${originExtension}`,
        `${filePath}/${file}.webp`,
        `-q ${IMAGE_QUALITY_CONVERSION}`,
        '-v'
      );

      if (!fs.existsSync(`${filePath}/${file}_small.${originExtension}`)) {
        resizeImages(filePath, `${file}.${originExtension}`, file);
      }

      setTimeout(() => {
        webp.cwebp(
          `${filePath}/${file}_small.${originExtension}`,
          `${filePath}/${file}_small.webp`,
          `-q ${IMAGE_QUALITY_CONVERSION}`,
          '-v'
        );
      }, 1000);
    } else {
      webp.cwebp(
        `${filePath}/${file}.${originExtension}`,
        `${filePath}/${file}_small.webp`,
        `-q ${IMAGE_QUALITY_CONVERSION}`,
        '-v',
        `-resize ${IMAGE_SMALL_SIZE} 0`
      );
    }
    resolve();
  });
};

export const processPlayIndex = () => {
  loadAllPlaysAsync().then((plays) => {
    const all_dirs = getAllPlaysLocally();
    writeFile(plays, all_dirs);
  });
};

const getAllPlaysLocally = () => {
  const all_files = fs.readdirSync(DIRECTORIES.PLAY);
  return all_files;
};

async function createPublicImages() {
  let success = false;
  await resizeImages('./src/images', 'thumb-play.png', 'thumb-play', 'png')
    .then(async (res) => {
      // get webp version
      await convertToWebp('./src/images', 'thumb-play', 'png');
    })
    .then(async (res) => {
      // be sure to get webp small version
      await convertToWebp('./src/images', 'thumb-play', 'webp');
    })
    .then(async (res) => {
      await copyImages('./src/images', './public/images', 'thumb-play.png');
      await copyImages('./src/images', './public/images', 'thumb-play_small.png');
      await copyImages('./src/images', './public/images', 'thumb-play.webp');
      await copyImages('./src/images', './public/images', 'thumb-play_small.webp');
      success = true;
    })
    .catch((error) => {
      Log.warning('createPublicImages', error);
    })
    .finally(() => {
      success && Log.log('Copied images in public/images');
    });
}

async function resizeImages(filePath, srcImage, destinationFileName = 'cover') {
  // Read the image.
  const type = await fileTypeFromFile(`${filePath}/${srcImage}`);

  if (type.ext === 'webp') {
    return convertToWebp(filePath, 'cover', 'webp');
  }

  const image = await Jimp.read(`${filePath}/${srcImage}`);
  await image.resize(240, Jimp.AUTO);
  await image.writeAsync(`${filePath}/${destinationFileName}_small.${type.ext}`);
}

const writeFile = (plays, dirs) => {
  let folderUp = !isPmpmWorkspace ? '../../' : '../../../';

  // developer can delete this file to generate all covers images again
  const hasPublicThumbImage = fs.existsSync('./public/images/thumb-play_small.webp');

  const playsPaths = new Map();

  fs.writeFileSync(INDEX_FILE_PATH, '// Do not modify the content of this file');
  plays.forEach(async (play, index) => {
    let playPath = play.kebab_name;
    let coverFileExtension = '';

    playsPaths.set('#playsUpwardPath', folderUp);

    if (play.path) {
      const pathSegmentation = play.path.split('/');
      if (pathSegmentation.length > 1 && play.dev_mode !== true) {
        playPath = pathSegmentation[2];
        if (playPath !== play.kebab_name) {
          Log.log(`Play name and path is not matching : ${play.name}(${playPath})`);
        }
      }
    }
    Log.log(`Checking play locally: ${play.name}(${playPath})`);
    if (dirs.indexOf(playPath) > -1) {
      Log.log(`Play found locally : ${playPath}`);
      const playCleanName =
        isValidString(play.component) ||
        toSanitized(play.title_name) ||
        toSanitized(play.kebab_name);

      // if no cover file found and an url was provided
      // we download a local copy
      // if we found thumb-play_small.webp in public dir, we don't download
      // from an url again to prevent to continuously request from these servers.

      if (BUILD_IMAGES && !hasPublicThumbImage && play?.cover) {
        const res = await axios.get(play.cover, { responseType: 'arraybuffer' });
        let fileType = await fileTypeFromBuffer(res.data);
        fs.writeFileSync(`${DIRECTORIES.PLAY}/${playPath}/cover.${fileType.ext}`, res.data);
      }

      BUILD_IMAGES && cleanUpFileExtension(DIRECTORIES.PLAY, playPath);

      BUILD_IMAGES && setTimeout(() => {
        // check for cover file and it's extension 1st time
        coverFileExtension = getPlayCoverExtension(playPath, play);

        if (!IMAGE_EXTENSIONS.includes(coverFileExtension)) {
          coverFileExtension = 'images/thumb-play.png';
        } else {
          // we create a webp image and small size from cover
          resizeAndCreateWebp(DIRECTORIES.PLAY, playPath, coverFileExtension);
        }

        playsPaths.set(`${playPath}/${playCleanName}`, [
          `${encodeURI(play.github.toLowerCase())}/${play.slug}`,
          coverFileExtension
        ]);
      }, index * 1000);

      !BUILD_IMAGES && playsPaths.set(`${playPath}/${playCleanName}`, [
          `${encodeURI(play.github.toLowerCase())}/${play.slug}`
      ]);


      // check if play has a package.json file or create it
      if (!fs.existsSync(`${DIRECTORIES.PLAY}/${playPath}/package.json`)) {
        processTemplate(play, 'pkg', `${DIRECTORIES.PLAY}/${playPath}`);
      }

      fs.appendFileSync(
        INDEX_FILE_PATH,
        `\n export { default as ${playCleanName} } from 'plays/${playPath}/${playCleanName}';`
      );
    } else {
      Log.warning(`Play not found locally : ${play.name}(${playPath})`);
    }
  });

  // copy thumbs image to public/images to avoid some problems
  BUILD_IMAGES && !hasPublicThumbImage && createPublicImages();

  plays.length &&
    setTimeout(() => {
      // if ./plays folder exists (use for mono repo)
      fs.writeFileSync(
        INDEX_JSON_FILE_PATH,
        `${JSON.stringify(Object.fromEntries(playsPaths), null, '\t')}`
      );
    }, plays.length * 1000);
};
