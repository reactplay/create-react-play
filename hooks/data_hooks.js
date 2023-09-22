import { loadPlay } from '../lib/services/datasource/index.js';
import { Log } from '../log/index.js';

export const data_read_table = (table_name) => {
  Log.log(`Reading ${table_name} table`);
};

export const data_read_play_by_id = async (arg) => {
  const data = await loadPlay(arg.value);
  return data;
};
