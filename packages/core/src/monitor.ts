import { merge } from "lodash-es";

export interface ObserveOption {
  /**
   * @description 最大等待
   */
  max_times: number;
  /**
   * @description 间隔时间
   */
  interval: number;
}

export const genObserveOption = (): ObserveOption => ({
  max_times: 5000,
  interval: 16.7,
});

export const observe = (polling: () => boolean, cb: () => unknown, _option?: Partial<ObserveOption>) => {
  let counter = 0;
  const option = merge(genObserveOption(), _option);

  const timer = setInterval(() => {
    counter++;

    if (polling()) {
      cb();
      clearInterval(timer);
    }
    if (counter * option.interval > option.max_times) {
      clearInterval(timer);
    }
  }, option.interval);
};

export class Observer {
  constructor(polling: () => boolean, cb: () => unknown, _option?: Partial<ObserveOption>) {
    Observer.observe(polling, cb, _option);
  }

  static observe(polling: () => boolean, cb: () => unknown, _option?: Partial<ObserveOption>) {
    let counter = 0;
    const option = merge(genObserveOption(), _option);

    const timer = setInterval(() => {
      counter++;

      if (polling()) {
        cb();
        clearInterval(timer);
      }
      if (counter * option.interval > option.max_times) {
        clearInterval(timer);
      }
    }, option.interval);
  }
}
