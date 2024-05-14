import { DataviewFile } from "interface/DataviewFile";

export interface PagesDataContextType {
	rendererPages: DataviewFile[]
	setRendererPages: React.Dispatch<React.SetStateAction<DataviewFile[]>>
	currentPageNum: number,
	setCurrentPageNum: React.Dispatch<React.SetStateAction<number>>,
	pagesSlice: () => DataviewFile[],
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
	pagesSearching :(filetingPages: DataviewFile[], search: string) => DataviewFile[],
	pagesFiltering ?: (filetingPages: DataviewFile[], selectList: number[]) => DataviewFile[],
	pagesSorting: (index: number) => void,
	header?: string
}
