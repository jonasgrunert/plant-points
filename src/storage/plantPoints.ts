import PouchDB from "pouchdb-browser";
import list from "../assets/list.json";

export const db = new PouchDB<{
  type: "log";
  date: string;
  plant: Plant;
}>("plant-points");

export type Category =
  | "vegetables"
  | "herbs"
  | "fruit"
  | "legumes"
  | "nuts"
  | "grains";
export type Plant = keyof typeof list;
