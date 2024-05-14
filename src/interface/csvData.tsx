import { DataviewFile } from "./DataviewFile";

export default interface CsvData {
	readonly pages: DataviewFile[];
	readonly rows: Array<string>;
	readonly selectedValue: number;
	readonly selectedArr: number[];
	readonly filter: null;
	readonly sort: string[];
	readonly selectedSortValue: number;
	readonly header?: string | null;
	readonly options?: Array<string> | null;
}

