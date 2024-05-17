import { sort } from "./pageData";
import { DataArray, DataObject } from "obsidian-dataview";

export default interface csvData {
	readonly pages: DataArray<DataObject>;
	readonly rows: Array<string>;
	readonly selectedValue: number;
	readonly selectedArr: number[];
	readonly filter: null;
	readonly sort: sort[];
	readonly selectedSortValue: number;
	readonly cls: string;
	readonly header?: string;
	readonly options?: Array<string>;
}

