import Header from "./Header";
import pageData from "interface/pageData";
import csvData from "interface/csvData";
import Select from "./Select";
import Pagination from "./Pagination";
import Search from "./Search";
import Filter from "./Filter";
import FilterList from "./FilterList";
import SortBtn from "./SortBtn";

export default function ToolBar({input}: {input: pageData | csvData}) {
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
					{input.filter && <Filter filter={input.filter} />}
					<SortBtn sort={input.sort} />
				</div>
			</div>
			{input.filter && <FilterList filter={input.filter} />}
		</>
	);
}
