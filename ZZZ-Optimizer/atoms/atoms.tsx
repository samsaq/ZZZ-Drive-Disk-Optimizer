import { atom } from "jotai";

//for global atoms needed across the whole app
//login data for the user (if logged in)
export const loginData = atom<{
  uuid: string;
}>({
  uuid: "",
});

//derived atom for isLoggedIn
export const isLoggedIn = atom((get) => get(loginData).uuid !== "");
