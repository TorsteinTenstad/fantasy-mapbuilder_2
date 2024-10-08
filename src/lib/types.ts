import { store } from "../store.svelte";
import type { Database } from "./database.types";
import dtb from "$lib/dtb"

export enum SearchParam {
	informatic_id = 'informatic'
}

export enum TargetType {
	Marker,
	Map,
	Informatic,
	ParentMap
}

export type MarkerData = Database["public"]["Tables"]["marker"]["Row"];
export type MarkerType = MarkerData["type"];
export type MapData = Database["public"]["Tables"]["map"]["Row"];
export type Article = Database["public"]["Tables"]["article"]["Row"];

export type ModalEntity = {
	image: string | null;
	title: string;
	func: () => void;
}

export type ModalData = {
	entities: ModalEntity[];
};

export const add_map: ModalEntity =
{
	image: "/assets/plus.png",
	title: "Add Map",
	func: () => { console.log('Map added :)') }
}

export const add_article: ModalEntity =
{
	image: "/assets/plus.png",
	title: "Add Article",
	func: async () => { await dtb.create_and_show_article() }
}