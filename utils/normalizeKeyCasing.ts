import { capitalizeString, isArray, isObject } from '@utils';

const normalizeKeyCasing = (arg: any): any => {
  let normalizedObject: any;

  if (isArray(arg)) {
    normalizedObject = arg.map((o: any) => normalizeKeyCasing(o));
  } else if (isObject(arg)) {
    normalizedObject = {};
    for (const key in arg) {
      const normalizedKey = key
        .split('_')
        .map((piece, index) => (index === 0 ? piece : capitalizeString(piece)))
        .join('');
      normalizedObject[normalizedKey] = arg[key]
        ? normalizeKeyCasing(arg[key])
        : null;
    }
  } else {
    normalizedObject = arg;
  }

  return normalizedObject;
};

export default normalizeKeyCasing;
