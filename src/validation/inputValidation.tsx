import pageData, { filter, sort } from "interface/pageData";

export default function inputValidation(source: string): pageData {
	const input = JSON.parse(`{${source}}`);
	const filter: filter[] = [{ label: "모두보기" }];
	
	// 정렬
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
	if (input.sort) sortList.push(...input.sort);
	if (input.filter) filter.push(...input.filter);
	const filterDefault: number[] = [];
	const inputFilterDefault = input.filterDefault;
	filter.forEach((item, index: number) => {
		// 기본적으로 사용하는 필터 추출
		if (inputFilterDefault && inputFilterDefault.some((b :string) => b === item.label)) {
			filterDefault.push(index);
		}
	})
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
		cls: input.cls || ""
	};

	if (!data) {
		throw new Error("작성된 쿼리에서 오류가 발생했습니다.");
	}
	return data;
}
