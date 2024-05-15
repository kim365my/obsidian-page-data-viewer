import { DataviewFile, Literal } from 'interface/DataviewFile';
import { filter } from "interface/pageData";

export function filterPages(page: DataviewFile, selectFilter: filter): boolean {
	const target = (selectFilter.target) ? String(selectFilter.target).toLowerCase() : "";
	// target이 프로퍼티인 경우 target은 key, target_content는 value인 형태
	const targetValue = selectFilter.target_content ? String(selectFilter.target_content).toLowerCase() : "";
	// filter type에 따라서 구분
	const isIncludeTarget = selectFilter.target_isInclude == "true" || false;

	switch (selectFilter.type) {
		case "tags": {
			const isIncludes = String(page.tags).includes(target);
			return (isIncludeTarget) ? isIncludes : !isIncludes;
		}
		case "property": {
			const property = page[target];
			if (targetValue) {
				if (property instanceof Date) {
					if (targetValue.includes("~")) {
						// 기간 설정
						const dateDuration = targetValue.split("~");
						const firstDate = new Date(dateDuration[0].trim());

						const lastDate = dateDuration[1].includes("now")
							? new Date()
							: new Date(dateDuration[1].trim());
						return firstDate <= property && lastDate >= property;
					} else {
						const date = new Date(targetValue);
						return Math.ceil(Math.abs(date.getTime() - property.getTime()) / (1000 * 60 * 60 * 24))=== 0;
					}
				} else if (property instanceof Array) {
					return property.includes(targetValue);
				} else {
					return String(property).toLowerCase() === targetValue;
				}
			} else {
				return (isIncludeTarget)
				? (property == null || property == undefined || property == "")
				: (property !== null && property !== undefined);
			}
		}
		// file
		// 문서내부의 전체 tags를 고르는 경우
		case "file.tags": {
			return page.file.tags.has(target);
		}
		case "file.name":
		case "file.aliases":
		case "file.link": {
			const fileName = String(page.file.name).toLowerCase();
			const fileAliases = page.file.aliases.values;
			const isInclude = fileName.includes(target.toLowerCase()) || fileAliases.some((value) => value.toLowerCase().includes(target.toLowerCase()));
			return (isIncludeTarget) ? isInclude : !isInclude;
		}
		case "file.inlinks":
		case "file.outlinks": {
			const type = selectFilter.type.replace("file.", "").trim();
			const fileType = page.file[type].values;
			return (isIncludeTarget) ? fileType.length !== 0 : fileType.some((value: Literal) => String(value.path).toLowerCase().includes(target));
		}
		default: {
			console.log("pageDataRenderer.js: 작성하신 필터 타입은 지원하지 않습니다.");
			break;
		}
	}
	return true;
}
