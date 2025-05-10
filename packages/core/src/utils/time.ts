import dayjs from "dayjs";

/**
 * 计算并返回给定时间与当前时间的差异
 * @param time
 * @param breakpoint 当超过某个点时，返回原始值
 * @returns
 */
export function diffNow(
  time: string,
  breakpoint?: "minute" | "hour" | "day" | "month" | "year" | "infinity",
) {
  const now = dayjs();
  const inputTime = dayjs(time);
  const diffInSeconds = now.diff(inputTime, "second");
  const diffInMinutes = now.diff(inputTime, "minute");
  const diffInHours = now.diff(inputTime, "hour");
  const diffInDays = now.diff(inputTime, "day");
  const diffInMonths = now.diff(inputTime, "month");
  const diffInYears = now.diff(inputTime, "year");

  const iters = [
    { breakpoint: "minute", label: "刚刚", value: 60 }, // 一分钟以内
    { breakpoint: "hour", label: `${diffInMinutes}分钟前`, value: 60 * 60 }, // 一小时以内
    { breakpoint: "day", label: `${diffInHours}小时前`, value: 60 * 60 * 24 }, // 一天以内
    { breakpoint: "month", label: `${diffInDays}天前`, value: 60 * 60 * 24 * 30 }, // 一月以内
    { breakpoint: "year", label: `${diffInMonths}月前`, value: 60 * 60 * 24 * 365 }, // 一年以内
    { breakpoint: "infinity", label: `${diffInYears}年前`, value: Number.POSITIVE_INFINITY }, // 一年以上
  ];

  for (const iter of iters) {
    if (breakpoint && diffInSeconds > iter.value) return time;
    if (diffInSeconds < iter.value) return iter.label;
  }
  return time;
}
