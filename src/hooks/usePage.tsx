import { useState } from "react";
import { filterPages } from "Utils/filterPages";
import { DataviewFile } from 'interface/DataviewFile';
import { PagesDataContextType } from "interface/PagesDataContextType";
import pageData from "interface/pageData";
import { DataArray } from "obsidian-dataview";

export function usePage(pages:DataArray<DataviewFile>, input:pageData): PagesDataContextType {
	const [rendererPages, setRendererPages] = useState(pages);
	// 현재 페이지
	const [currentPageNum, setCurrentPageNum] = useState(1);
	// 화면에 표시할 데이터 리스트 갯수
	const [viewListNum, setViewListNum] = useState(input.selectedValue);
	const selectedArr = input.selectedArr;

	// pagination 버튼 갯수
	const viewBtnNum = 10;
	const fullPaginationNum = Math.ceil(rendererPages.length / viewListNum);

	// 검색
	const [searchValue, setSearchValue] = useState("");
	const pagesSearching = (filetingPages: DataArray<DataviewFile>, search: string) => {
		if (search === "") {
			return filetingPages;
		} else {
			const searchPages = filetingPages?.filter((page: DataviewFile) =>
				page.file.name.toLowerCase().includes(search)
			);
			return searchPages;
		}
	};
	const handleSearch = (search: string) => {
		setSearchValue(search);
		setRendererPages(pagesSearching(pages, search));
	};
	const handleSearchInit = () => {
		setSearchValue("");
		setRendererPages(pages);
	};
	// 필터
	const [selectFilterValue, setSelectFilterValue] = useState(
		input.filterDefault
	);
	const pagesFiltering = (
		filetingPages: DataArray<DataviewFile>,
		selectList: number[]
	) => {
		const renderer = filetingPages.filter((page: DataviewFile) => {
			let result = true;
			selectList.forEach((item) => {
				result = result && filterPages(page, input.filter[item]);
			});
			return result;
		});
		return renderer;
	};
	const handleFilter = (index: number) => {
		if (selectFilterValue.includes(index)) {
			deleteFilter(index);
		} else {
			let filetingPages = pages;
			if (index === 0) {
				setSelectFilterValue([]);
			} else {
				const selectList = [...selectFilterValue];
				selectList.push(index);
				setSelectFilterValue(selectList);

				// 검색어가 존재할 경우
				if (searchValue !== "") {
					filetingPages = pagesSearching(pages, searchValue);
				}
				filetingPages = pagesFiltering(filetingPages, selectList);
			}
			setRendererPages(filetingPages);
		}
	};
	const deleteFilter = (index: number) => {
		const selectList = selectFilterValue.filter(
			(select) => select !== index
		);
		setSelectFilterValue(selectList);

		let filetingPages = pages;
		if (selectList.length !== 0) {
			// 검색어가 존재할 경우
			if (searchValue !== "") {
				filetingPages = pagesSearching(pages, searchValue);
			}
			filetingPages = pagesFiltering(filetingPages, selectList);
		}
		setRendererPages(filetingPages);
	};

	// 정렬
	const [selectSortNum, setSelectSortNum] = useState(input.selectedSortValue);
	const pagesSorting = (index: number) => {
		const selectSort = input.sort[index];
		let renderer;
		if (selectSort.type.includes("file")) {
			const fileType = selectSort?.type.substring(
				selectSort.type.indexOf("file.") + 5,
				selectSort.type.length
			);
			renderer = rendererPages.sort((b: DataviewFile) => b.file[fileType],selectSort.sort);
		} else {
			if (selectSort.type === "created") {
				const isCreated = rendererPages[0]["created"]
				if (isCreated === null) {
					return rendererPages.sort((b: DataviewFile) => b.file.ctime, selectSort.sort);
				}
			}
			renderer = rendererPages.sort((b: DataviewFile) => b[selectSort.type],selectSort.sort);
		}
		return renderer;
	};
	const handleSort = (index: number) => {
		if (index !== selectSortNum) {
			setSelectSortNum(index);
			setRendererPages(pagesSorting(index));
		}
	};

	// 페이지 슬라이스
	const pageSlice = () => {
		// 정렬
		const renderData = pagesSorting(selectSortNum);
		// 슬라이스
		const startNum = (currentPageNum - 1) * viewListNum;
		const endNum = (currentPageNum - 1) * viewListNum + viewListNum;
		const data = renderData.slice(startNum, endNum);
		return data;
	};

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
		selectFilterValue,
		setSelectFilterValue,
		handleFilter,
		deleteFilter,
		selectSortNum,
		setSelectSortNum,
		handleSort,
		pagesSearching,
		pagesFiltering,
		pagesSorting,
		pageSlice
	};
}

