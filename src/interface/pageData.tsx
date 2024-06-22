import { DataArray, DataObject } from "obsidian-dataview";
export interface pageData {
	readonly pages: string;
	readonly rows: Array<string>;
	readonly selectedValue: number;
	readonly selectedArr: number[];
	readonly filter: filter[];
	readonly filterDefault: number[];
	readonly filterList?: string[];
	readonly sort: sort[];
	readonly selectedSortValue: number;
	readonly cls: string;
	readonly header?: string;
	readonly options?: Array<string>;
}

export interface csvData {
	readonly pages: DataArray<DataObject>;
	readonly rows: Array<string>;
	readonly selectedValue: number;
	readonly selectedArr: number[];
	readonly filter: filter[];
	readonly filterDefault: number[];
	readonly filterList?: string[];
	readonly sort: sort[];
	readonly selectedSortValue: number;
	readonly cls: string;
	readonly header?: string;
	readonly options?: Array<string>;
}

export interface filter {
	"label": string;
	"class"?: string;
	"type"?: "tags" | "property" | "file.tags" | "file.name" | "file.aliases" | "file.link" | "file.inlinks" | "file.outlinks";
	"target"?: string;
	"target_content"?: string;
	"target_isInclude"?: string;
}
export interface sort {
	"label": string;
	"type": string;
	"sort": "desc" | "asc";
}