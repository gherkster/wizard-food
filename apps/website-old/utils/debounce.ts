/**
 * Debounce a given function to reduce excessive calls to the function.
 * @param callback The callback function to debounce
 * @param delay The milliseconds to delay
 */
export const debounce = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
): ((...args: T) => void) => {
  let timer: Timeout | null = null;

  return (...args: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      callback.call(null, ...args);
    }, delay);
  };
};

type Timeout = ReturnType<typeof setTimeout>;
