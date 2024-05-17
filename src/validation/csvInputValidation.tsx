import csvData from "interface/csvData";
import { sort } from "interface/pageData";

export default function csvInputValidation(source: string): csvData {
	const input = JSON.parse(`{${source}}`);
	const defaultSelectedArr = [5, 10, 20, 30, 40, 50];
	const sortList: sort[] = [
		{
			label: "작성순 (알파벳 순)",
			type: "title",
			sort: "desc",
		},
		{
			label: "작성순 (알파벳 역순)",
			type: "title",
			sort: "asc",
		},
	];
	if (input.sort) sortList.push(...input.sort);
	if (input.selectedValue && !defaultSelectedArr.includes(input.selectedValue)) defaultSelectedArr.push(input.selectedValue);
	const selectedArr = defaultSelectedArr.sort((a, b) => a - b);
	
	const data = {
		pages: input.pages,
		rows: input.rows ?? ["title"],
		selectedValue: input.selectedValue ?? 10,
		selectedArr: selectedArr,
		filter: null,
		sort: sortList,
		selectedSortValue: input.sortDefault ?? 0,
		header: input.header || null,
		options: input.options || null,
		cls: input.cls || ""
	};
	if (!data) {
		throw new Error("작성된 쿼리에서 오류가 발생했습니다.");
	}
	return data;
}

