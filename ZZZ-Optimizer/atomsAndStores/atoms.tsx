import { atom } from "jotai";

//for global atoms needed across the whole app
export const initialSync = atom<boolean>(false);
