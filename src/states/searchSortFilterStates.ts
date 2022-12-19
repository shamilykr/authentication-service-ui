import { atom } from "recoil";

export const sortCountAtom = atom({
  key: "sort",
  default: 0,
});

export const statusFilterAtom = atom({
  key: "statusFilter",
  default: [],
});

export const groupFilterAtom = atom({
  key: "groupFilter",
  default: [],
});

export const searchAtom = atom({
  key: "search",
  default: "",
});

export const paginationAtom = atom({
  key: "pagination",
  default: 1,
});
