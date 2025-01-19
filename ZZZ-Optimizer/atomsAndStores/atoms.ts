import { atom } from "jotai";

//for global atoms needed across the whole app

//used to make sure we only sync disk drive data once unless manually triggered
//to avoid giving me an uneeded API bill
export const initialSync = atom<boolean>(false);

//Used by the navbar to display the current page title
export const pageTitle = atom<string>("");
