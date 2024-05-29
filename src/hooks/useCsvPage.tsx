import { PagesDataContextType } from 'interface/PagesDataContextType';
import { useState } from 'react';
import { DataArray, DataObject } from "obsidian-dataview";
import csvData from 'interface/csvData';
import { Platform } from "obsidian";

export default function useCsvPage(pages:DataArray<DataObject>, input:csvData): PagesDataContextType {
    const [rendererPages, setRendererPages] = useState(pages);
	// 현재 페이지
	const [currentPageNum, setCurrentPageNum] = useState(1);
	// 화면에 표시할 데이터 리스트 갯수
	const [viewListNum, setViewListNum] = useState(input.selectedValue);
	const selectedArr = input.selectedArr;

	// pagination 버튼 갯수
	const viewBtnNum = (Platform.isPhone)? 8 : 10;
	const fullPaginationNum = Math.ceil(rendererPages?.length / viewListNum);

    // 검색
	const [searchValue, setSearchValue] = useState("");
	const pagesSearching = (filetingPages: DataArray<DataObject>, search: string) => {
		let result = filetingPages;
		if (search !== "") {
			search = search.toLowerCase().trim();
			const rows = input.rows;
			result = result?.filter((page: DataObject) => {
				let isFilter = false;
				rows.forEach((row) => {
					const value = page[row];
					if (value) {
						isFilter = isFilter || String(value).toLowerCase().includes(search);
					}
				})
				return isFilter;
			});
		}
		return result;
	}
	const handleSearch = (search: string) => {
		setSearchValue(search);
		setRendererPages(pagesSearching(pages, search));
	}
	const handleSearchInit = () => {
		setSearchValue("");
		setRendererPages(pages);
	}

	// 정렬
	const [selectSortNum, setSelectSortNum] = useState(input.selectedSortValue);
	const pagesSorting = (index: number) => {
		const renderer = rendererPages;
		if (index !== selectSortNum) {
			renderer.values = renderer.values.reverse();
		}
		return renderer;
	}
	const handleSort = (index: number) => {
		if (index !== selectSortNum) {
			setSelectSortNum(index);
			pagesSorting(index);
		}
	}
	const pageSlice = () => {
		const startNum = (currentPageNum -1) * viewListNum;
		const endNum = ((currentPageNum -1) * viewListNum) + viewListNum
		const data = rendererPages.slice(startNum, endNum);
		return data
	}

	return {
		rendererPages,
		setRendererPages,
		currentPageNum,
		setCurrentPageNum,
		viewListNum,
		setViewListNum,
		viewBtnNum,
		fullPaginationNum,
		selectedArr,
		searchValue,
		setSearchValue,
		handleSearch,
		handleSearchInit,
		selectSortNum,
		setSelectSortNum,
		handleSort,
		pagesSearching,
		pagesSorting,
		pageSlice,
	};
}
