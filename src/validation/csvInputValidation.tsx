import { getRealFile } from "Utils/getFileRealLink";
import { csvData, sort } from "interface/pageData";
import { parseYaml } from "obsidian";

export default function csvInputValidation(source: string): csvData {
	try {		
		const input = parseYaml(source);
		const data = {
			pages: getRealFile(input.pages).path,
			rows: input.rows || ["title"],
			selectedValue: input.selectedValue ?? 10,
			selectedArr: handleSelectedArrValue(input.selectedValue),
			filter: [],
			filterDefault: [],
			sort: handleSort(input.sort),
			selectedSortValue: input.sortDefault ?? 0,
			header: input.header || null,
			options: input.options || null,
			cls: input.cls || ""
		};
		return data;
	} catch (error) {
		throw new Error("작성된 쿼리에서 오류가 발생했습니다.");	
	}
}

function handleSelectedArrValue(selectedValue: number | null) {
	const selectedArr = [5, 10, 20, 30, 40, 50];

	if (selectedValue && !selectedArr.includes(selectedValue)) {
		selectedArr.push(selectedValue);
		selectedArr.sort((a, b) => a - b);
	}

	return selectedArr;
}

function handleSort(sort: sort[] | null) {
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
	if (sort) sortList.push(...sort);
	return sortList;
}
