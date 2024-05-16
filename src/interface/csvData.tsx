import { DataviewFile } from "./DataviewFile";
import { sort } from "./pageData";
import { DataArray } from "obsidian-dataview";

export default interface CsvData {
	readonly pages: DataArray<DataviewFile>;
	readonly rows: Array<string>;
	readonly selectedValue: number;
	readonly selectedArr: number[];
	readonly filter: null;
	readonly sort: sort[];
	readonly selectedSortValue: number;
	readonly cls: string;
	readonly header?: string | null;
	readonly options?: Array<string> | null;
}

