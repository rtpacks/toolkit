const opt = Object.prototype.toString;

export function isUndefined(obj: any): obj is undefined {
  return obj === undefined;
}

export function isNull(obj: any): obj is null {
  return obj === null;
}

export function isNone(obj: any): obj is null | undefined {
  return isUndefined(obj) || isNull(obj);
}

export const isExactIPv4 = (str: string) =>
  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
    str,
  );

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

export const isDateTimeStr = (str: string) => {
  return /((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\s+([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])/.test(
    str,
  );
};

export const isDomain = (str: string) => {
  return /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/.test(str);
};

export function isFile(obj: any): obj is File {
  return opt.call(obj) === "[object File]";
}

export function isBlob(obj: any): obj is Blob {
  return opt.call(obj) === "[object Blob]";
}
