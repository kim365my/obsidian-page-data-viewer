import pageData, { filter, sort } from "interface/pageData";

// 정렬
const sortList: sort[] = [
	{
		label: "생성일순 (최신순)",
		type: "file.ctime",
		sort: "desc",
	},
	{
		label: "생성일순 (오래된순)",
		type: "file.ctime",
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
		type: "file.link",
		sort: "asc",
	},
	{
		label: "파일이름 (알파벳 역순)",
		type: "file.link",
		sort: "desc",
	},
];

export default function inputValidation(source: string): pageData {
	const input = JSON.parse(`{${source}}`);
	const filter: filter[] = [{ label: "모두보기" }];
	if (input.sort) sortList.push(input.sort);
	if (input.filter) filter.push(...input.filter);
	const filterDefault = input.filterDefault ? input.filterDefault : [];
	const defaultSelectedArr = [5, 10, 20, 30, 40, 50];
	if (
		input.selectedValue &&
		!defaultSelectedArr.includes(input.selectedValue)
	)
		defaultSelectedArr.push(input.selectedValue);
	const selectedArr = defaultSelectedArr.sort((a, b) => a - b);
	const data = {
		pages: input.pages,
		rows: input.rows || ["file.link"],
		selectedValue: input.selectedValue ?? 10,
		selectedArr: selectedArr,
		filter: input.filter ? filter : [],
		filterDefault: input.filter ? filterDefault : [],
		sort: sortList,
		selectedSortValue: input.sortDefault ?? 0,
		header: input.header || null,
		options: input.options || null,
	};

	if (!data) {
		throw new Error("작성된 쿼리에서 오류가 발생했습니다.");
	}
	return data;
}
