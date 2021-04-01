import { isArray, isFunction } from '@utils';

const isObject = (arg: any): boolean =>
  !isArray(arg) && !isFunction(arg) && arg === Object(arg);

export default isObject;
