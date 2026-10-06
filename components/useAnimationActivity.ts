"use client";
import { useEffect, useState, type RefObject } from "react";

// One shared activity clock/listener set, regardless of character count.
const subscribers = new Set<() => void>();
let awake = true;
let timer: ReturnType<typeof setTimeout> | undefined;
function publish(value: boolean) {
  if (awake === value) return;
  awake = value;
  subscribers.forEach((notify) => notify());
}
function wake() {
  clearTimeout(timer);
  // wake() only fires on genuine engagement (pointermove, scroll, keydown,
  // focus, visibilitychange), so activity alone is enough to run — don't also
  // require document.hasFocus(), which froze the cursor-follow on a freshly
  // loaded window until the first click. blur still suspends; so does the
  // idle timeout below and a hidden tab.
  publish(!document.hidden);
  timer = setTimeout(() => publish(false), 5000);
}
function suspend() { clearTimeout(timer); publish(false); }
export function useAnimationActivity(ref: RefObject<Element | null>) {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    let visible = false;
    const update = () => setRunning(visible && awake);
    const first = subscribers.size === 0;
    subscribers.add(update);
    if (first) {
      window.addEventListener("pointermove", wake, { passive: true });
      window.addEventListener("scroll", wake, { passive: true });
      window.addEventListener("keydown", wake);
      window.addEventListener("focus", wake);
      window.addEventListener("blur", suspend);
      document.addEventListener("visibilitychange", wake);
      wake();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      subscribers.delete(update);
      if (!subscribers.size) {
        clearTimeout(timer);
        window.removeEventListener("pointermove", wake);
        window.removeEventListener("scroll", wake);
        window.removeEventListener("keydown", wake);
        window.removeEventListener("focus", wake);
        window.removeEventListener("blur", suspend);
        document.removeEventListener("visibilitychange", wake);
      }
    };
  }, [ref]);
  return running;
}
