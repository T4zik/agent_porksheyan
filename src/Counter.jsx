import { create } from "zustand";

const useStore = create((set) => ({
  count: false,
}));

export function counter(a) {
  const { count } = useStore();
  if (a == true) {
    count = true;
  } else {
    count = false;
  }
  return count;
}
