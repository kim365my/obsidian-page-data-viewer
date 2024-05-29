import { PagesDataContext } from "context/PagesDataContext";
import { useEffect, useState } from "react";
import useCsvPage from "hooks/useCsvPage";
import csvInputValidation from "validation/csvInputValidation";
import getDataviewAPI from "API/Dataview";
import ToolBar from "components/toolbar/ToolBar";
import Table from "components/table/Table";
import Lading from "components/Lading";
import { MarkdownPostProcessorContext } from "obsidian";
import { DataArray, DataObject } from "obsidian-dataview";

export default function CsvTableView({
	ctx,
	source,
}: {
	ctx: MarkdownPostProcessorContext;
	source: string;
}) {
	const dv = getDataviewAPI();
	const input = csvInputValidation(source);
	const [isLoading, setIsLoading] = useState(true);
	const [pages, setPages] = useState([]);
	const pageData = useCsvPage(pages, input);

	useEffect(() => {
		dv.io.csv(input.pages).then((data: DataArray<DataObject>) => {
			setPages(data);
			if (data.length !== 0) {
				// 검색
				if (pageData.searchValue !== "") {
					data = pageData.pagesSearching(data, pageData.searchValue);
				}
				// 정렬
				if (input.selectedSortValue !== 0) {
					data.values = data.values.reverse();
				}
				pageData.setRendererPages(data);
			}
		});

		if (isLoading) {
			setIsLoading(false);
		}
	}, []);

	return (
		<PagesDataContext.Provider value={pageData}>
			{isLoading ? (
				<Lading />
			) : (
				<>
					<ToolBar input={input} />
					<div className={input.cls}>
						<Table
							pages={pageData.pageSlice()}
							rows={input.rows}
							sourcePath={ctx.sourcePath}
						/>
					</div>
				</>
			)}
		</PagesDataContext.Provider>
	);
}
