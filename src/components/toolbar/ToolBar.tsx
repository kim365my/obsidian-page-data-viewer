import Header from "./Header";
import Select from "./Select";
import Pagination from "./Pagination";
import Search from "./Search";
import Filter from "./menu/Filter";
import AppliedFilter from "./AppliedFilter";
import { csvData, pageData } from "interface/pageData";
import FilterList from "./menu/FilterList";
import SortBtn from "./menu/SortBtn";
import { DataArray, DataObject } from "obsidian-dataview";

export default function ToolBar({input, pages}: {input: pageData | csvData, pages: DataArray<DataObject>}) {
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
						<Filter filter={input.filter} />
					)}
					<SortBtn sort={input.sort} />
				</div>
			</div>
			<div className="filter-showing-box">
				{input.filterList && input.filterList.length !== 0 && (
					<div className="filter-list-container">
						{input.filterList.map((item, index) => (
							<FilterList
								pages={pages}
								property={item}
								key={index}
							/>
						))}
					</div>
				)}
				{input.filter && <AppliedFilter filter={input.filter} />}
			</div>
		</>
	);
}
