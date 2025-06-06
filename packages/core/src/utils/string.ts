import { upperFirst } from "lodash-es";

export const connect = (prefix: string, ...suffixs: string[]) => {
  return `${prefix}${suffixs.map((str) => upperFirst(str)).join("")}`;
};
