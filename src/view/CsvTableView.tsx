import { PagesDataContext } from "context/PagesDataContext";
import { useEffect, useState } from "react";
import { DataviewFile } from "interface/DataviewFile";
import useCsvPage from "hooks/useCsvPage";
import csvInputValidation from "validation/csvInputValidation";
import getDataviewAPI from "API/Dataview";
import ToolBar from "components/toolbar/ToolBar";
import Table from "components/table/Table";

export default function CsvTableView({ source }: { source: string }) {
	const dv = getDataviewAPI();

	const input = csvInputValidation(source);
	const [pages, setPages] = useState([] as DataviewFile[]);
	const pageData = useCsvPage(pages, input);
	useEffect(() => {
		dv.io.csv(input.pages).then((csv: DataviewFile[]) => {
			setPages(csv);
			// 검색
			if (pageData.searchValue !== "") {
				csv = pageData.pagesSearching(csv, pageData.searchValue);
			}
			pageData.setRendererPages(csv);
		});
	}, []);

	return (
		<PagesDataContext.Provider value={pageData}>
			<ToolBar input={input} />
			<Table pages={pageData.pagesSlice()} rows={input.rows} type="csv" />
		</PagesDataContext.Provider>
	);
}
