export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export function isNull(obj: any): obj is null {
  return obj === null;
}

export function isNone(obj: any): obj is null | undefined {
  return isUndefined(obj) || isNull(obj);
}

export const isCIDRIP = (str: string) => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:(\/([1-9]|[1-2]\d|3[0-2])))$/.test(
    str,
  );
};

export const isRangeSplitterIP = (str: string, split = "-") => {
  const regex = new RegExp(
    `^(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})${split}(\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})$`,
  );
  return regex.test(str);
};

export const isRangeIP = (str: string, split = "-") => {
  return isCIDRIP(str) || isRangeSplitterIP(str, split);
};

export const isIP = (str: string) => {
  return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(
    str,
  );
};

export const isASCII = (str: string) => {
  return /^[\x00-\x7F]+$/.test(str);
};
