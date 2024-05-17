import { filter } from "interface/pageData";
import { Literal, DataObject } from "obsidian-dataview";

export function filterPages(page: DataObject, selectFilter: filter): boolean {
	const target = (selectFilter.target) ? String(selectFilter.target).toLowerCase() : "";
	// target이 프로퍼티인 경우 target은 key, target_content는 value인 형태
	const target_content = selectFilter.target_content ? String(selectFilter.target_content).toLowerCase() : "";
	// filter type에 따라서 구분
	const target_isInclude = selectFilter.target_isInclude === "true" || false;

	switch (selectFilter.type) {
		case "tags": {
			const isIncludes = String(page.tags).includes(target);
			return (target_isInclude) ? isIncludes : !isIncludes;
		}
		case "property": {
			const property = page[target];
			if (target_content) {
				if (property instanceof Date) {
					if (target_content.includes("~")) {
						// 기간 설정
						const dateDuration = target_content.split("~");
						const firstDate = new Date(dateDuration[0].trim());

						const lastDate = dateDuration[1].includes("now")
							? new Date()
							: new Date(dateDuration[1].trim());
						return firstDate <= property && lastDate >= property;
					} else {
						const date = new Date(target_content);
						return Math.ceil(Math.abs(date.getTime() - property.getTime()) / (1000 * 60 * 60 * 24))=== 0;
					}
				} else if (property instanceof Array) {
					return property.includes(target_content);
				} else {
					return String(property).toLowerCase() === target_content;
				}
			} else {
				return (target_isInclude)
				? (property !== null && property !== undefined)
				: (property == null || property == undefined || property == "");
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
			const fileName = page.file.name.toLowerCase();
			const fileAliases = page.file.aliases.values;
			const isInclude = fileName.includes(target.toLowerCase()) || fileAliases.some((value: string) => value.toLowerCase().includes(target.toLowerCase()));
			return (target_isInclude) ? isInclude : !isInclude;
		}
		case "file.inlinks": {
			const fileType = page.file.inlinks.values;
			return (target_isInclude) ? fileType.length !== 0 : fileType.some((value: Literal) => String(value.path).toLowerCase().includes(target));
		}
		case "file.outlinks": {
			const fileType = page.file.outlinks.values;
			return (target_isInclude) ? fileType.length !== 0 : fileType.some((value: Literal) => String(value.path).toLowerCase().includes(target));
		}
		default: {
			console.log("pageDataRenderer.js: 작성하신 필터 타입은 지원하지 않습니다.");
			break;
		}
	}
	return true;
}
