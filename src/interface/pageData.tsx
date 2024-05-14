export default interface pageData {
	readonly pages: string;
	readonly rows: Array<string>;
	readonly selectedValue: number;
	readonly selectedArr: number[];
	readonly filter: filter[];
	readonly filterDefault: number[];
	readonly sort: sort[];
	readonly selectedSortValue: number;
	readonly header?: string | null;
	readonly options?: Array<string> | null;
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
