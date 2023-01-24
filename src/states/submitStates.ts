import { atom } from "recoil";

export const submitAtom = atom<boolean>({
  key: "Submit",
  default: false,
});
