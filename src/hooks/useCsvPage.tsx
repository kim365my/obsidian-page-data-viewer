import { DataviewFile } from 'interface/DataviewFile';
import { PagesDataContextType } from 'interface/PagesDataContextType';
import CsvData from 'interface/csvData';
import { useCallback, useEffect, useState } from 'react';

export default function useCsvPage(pages:DataviewFile[], input:CsvData): PagesDataContextType {
    const [rendererPages, setRendererPages] = useState(pages);
	// 현재 페이지
	const [currentPageNum, setCurrentPageNum] = useState(1);
	// 화면에 표시할 데이터 리스트 갯수
	const [viewListNum, setViewListNum] = useState(input.selectedValue);
	const selectedArr = input.selectedArr;

	// pagination 버튼 갯수
	const viewBtnNum = 10;
	const fullPaginationNum = Math.ceil(rendererPages?.length / viewListNum);

    // 검색
	const [searchValue, setSearchValue] = useState("");
	const pagesSearching = (filetingPages: DataviewFile[], search: string) => {
		let searchPages = filetingPages;
		if (search !== "") {
			searchPages = searchPages?.filter((page) => page?.title?.toLowerCase().includes(search));
		}
		return searchPages;
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
			renderer.values  = renderer.values.reverse();
		}
		return renderer;
	}
	const handleSort = (index: number) => {
		if (index !== selectSortNum) {
			setSelectSortNum(index);
			pagesSorting(index);
		}
	}

	// 페이지 슬라이스
	const pagesSlice = () => {
		const renderer = pagesSorting(selectSortNum);
		const slice = renderer?.slice(((currentPageNum -1) * viewListNum), ((currentPageNum -1) * viewListNum) + viewListNum);
		return slice;
	}

	// 페이지 초기화
	const initPages = useCallback(() => {
		setRendererPages(pages);
	}, [])
	// pages가 변하면 renderer에 적용
	useEffect(() => {
		initPages();
	}, [initPages])

	return { rendererPages, setRendererPages, currentPageNum, setCurrentPageNum, pagesSlice, viewListNum, setViewListNum, viewBtnNum, fullPaginationNum, selectedArr, searchValue, setSearchValue, handleSearch, handleSearchInit, selectSortNum, setSelectSortNum, handleSort, pagesSearching, pagesSorting };
}
