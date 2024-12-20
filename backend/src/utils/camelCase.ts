import { camelCase } from 'lodash'
import _ from 'lodash';

const camelize = (obj: any) : any => {
    if (Array.isArray(obj)) {
        return obj.map(v => camelize(v));
      } else if (_.isPlainObject(obj)) {
        return Object.keys(obj).reduce(
          (result, key) => ({
            ...result,
            [camelCase(key)]: camelize(obj[key]),
          }),
          {},
        );
      }
      return obj;
}

export default (obj: any) => camelize(obj);