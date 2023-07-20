import { submit } from 'json-graphql-parser';
import { Log } from '../../../log/index.js';
import { FETH_ALL_PLAYS } from './query.js';
import {
  toKebabCase,
  toPascalcase,
  toSanitized,
  toSlug,
  toTitleCase,
  toTitleCaseTrimmed
} from '../../../util/string.js';

// const URL = `${process.env.NHOST_ROTOCOL}://${process.env.NHOST_SERVER}/${process.env.NHOST_ENDPOINT}`;
const URL = 'https://rgkjmwftqtbpayoyolwh.hasura.ap-southeast-1.nhost.run/v1/graphql';

export const loadPlay = async (id) => {
  const res = await loadPlayAsync(id);
  return res;
};

export const loadPlayAsync = (id) => {
  Log.log(`Reading play information of "${id}"`);
  return submit(
    {
      ...FETH_ALL_PLAYS,
      ...{
        where: {
          operator: '',
          clause: [
            {
              field: 'id',
              operator: 'eq',
              value: id,
              type: 'string'
            }
          ]
        }
      }
    },
    URL
  )
    .then((res) => {
      const play = processPlayInformation(res[0]);
      return play;
    })
    .catch((err) => {
      console.error('Error occured');
      console.error(`Status ${err.response.status} : ${err.response.statusText}`);
    });
};

export const loadAllPlays = async () => {
  const res = await loadAllPlaysAsync(id);
  return res;
};

export const loadAllPlaysAsync = () => {
  Log.log(`Getting all plays`);
  return submit(FETH_ALL_PLAYS, URL)
    .then((res) => {
      const play_list = [];
      res.forEach((play) => {
        play_list.push(processPlayInformation(play));
      });
      return play_list;
    })
    .catch((err) => {
      console.error('Error occured');
      console.error(`Status ${err.response.status} : ${err.response.statusText}`);
    });
};

const processPlayInformation = (play) => {
  play.kebab_name = play.slug;
  play.pascal_name = toPascalcase(toSanitized(play.name));
  play.title_string = toTitleCase(play.name);
  play.title_name = toTitleCaseTrimmed(play.name);
  play.title_name_sanitized = toSanitized(play.title_name);
  play.level = play.level.name;
  return play;
};
