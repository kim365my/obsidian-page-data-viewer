import { getFileRelativePath } from "Utils/getFileRealLink";
import pageData, { filter, sort } from "interface/pageData";
import { parseYaml } from "obsidian";

export default function inputValidation(source: string): pageData {
	try {
		const input = parseYaml(source);
		const data = {
			pages: (input.pages) ? getFileRelativePath(input.pages): "",
			rows: input.rows || ["file.link"],
			selectedValue: input.selectedValue ?? 10,
			selectedArr: handleSelectedArrValue(input.selectedValue),
			filter: handleFilter(input.filter),
			filterDefault: handleFilterDefault(input.filter, input.filterDefault),
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

function handleFilter(filter: filter[] | null) {
	const filterArr: filter[] = [];
	if (filter) {
		filterArr.push({ label: "모두보기" }, ...filter);
	}
	return filterArr;
}

function handleFilterDefault(filter: filter[] | null, inputFilterDefault: string[] | null) {
	const filterDefault: number[] = [];
	if (filter && inputFilterDefault) {
		filter.forEach((item, index: number) => {
			// 기본적으로 사용하는 필터 추출
			if (inputFilterDefault.some((b :string) => b === item.label)) {
				filterDefault.push(index + 1);
			}
		})
	}
	return filterDefault;
}

function handleSort(sort: sort[] | null) {
	const sortList: sort[] = [
		{
			label: "생성일순 (최신순)",
			type: "created",
			sort: "desc",
		},
		{
			label: "생성일순 (오래된순)",
			type: "created",
			sort: "asc",
		},
		{
			label: "업데이트일순 (최신순)",
			type: "file.mtime",
			sort: "desc",
		},
		{
			label: "업데이트일순 (오래된순)",
			type: "file.mtime",
			sort: "asc",
		},
		{
			label: "파일이름 (알파벳순)",
			type: "file.name",
			sort: "asc",
		},
		{
			label: "파일이름 (알파벳 역순)",
			type: "file.name",
			sort: "desc",
		},
	];
	if (sort) sortList.push(...sort);

	return sortList;
}