import Header from "./Header";
import pageData from "interface/pageData";
import csvData from "interface/csvData";
import Select from "./Select";
import Pagination from "./Pagination";
import Search from "./Search";
import Filter from "./Filter";
import FilterList from "./FilterList";
import SortBtn from "./SortBtn";
import { Platform } from "obsidian";

export default function ToolBar({input}: {input: pageData | csvData}) {
	const isMobile = Platform.isPhone;
	return (
		<>
			{input.header && <Header header={input.header} />}
			<div className="toolbar">
				<div className="toolbar-left">
					<Select />
					<Pagination />
				</div>
				<div className="toolbar-right">
					<Search />
					{input.filter && input.filter.length !== 0 && (
						<Filter filter={input.filter} isMobile={isMobile} />
					)}
					<SortBtn sort={input.sort} isMobile={isMobile} />
				</div>
			</div>
			{input.filter && <FilterList filter={input.filter} />}
		</>
	);
}
