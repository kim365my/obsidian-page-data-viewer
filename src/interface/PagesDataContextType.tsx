import { DataArray, DataObject } from "obsidian-dataview";

export interface PagesDataContextType {
	rendererPages: DataArray<DataObject>
	setRendererPages: React.Dispatch<React.SetStateAction<DataArray<DataObject>>>
	currentPageNum: number,
	setCurrentPageNum: React.Dispatch<React.SetStateAction<number>>,
	viewListNum: number,
	setViewListNum:  React.Dispatch<React.SetStateAction<number>>,
	viewBtnNum: number,
	fullPaginationNum: number,
	selectedArr: number[],
	searchValue: string,
	setSearchValue: React.Dispatch<React.SetStateAction<string>>,
	handleSearch: (search: string) => void,
	handleSearchInit: () => void,
	selectFilterValue?: number[],
	setSelectFilterValue?: React.Dispatch<React.SetStateAction<number[] | undefined>>,
	handleFilter?: (index: number) => void,
	deleteFilter?: (index: number) => void,
	selectSortNum: number,
	setSelectSortNum: React.Dispatch<React.SetStateAction<number>>,
	handleSort: (index: number) => void,
	pagesSearching :(filetingPages: DataArray<DataObject>, search: string) => DataArray<DataObject>,
	pagesFiltering ?: (filetingPages: DataArray<DataObject>, selectList: number[]) => DataArray<DataObject>,
	pagesSorting: (index: number) => void,
	pageSlice: () => DataArray<DataObject>
}
