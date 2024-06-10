import Table from "components/table/Table";
import { PagesDataContext } from "context/PagesDataContext";
import { usePage } from "hooks/usePage";
import inputValidation from "validation/inputValidation";
import { useEffect, useState } from "react";
import getDataviewAPI from "API/Dataview";
import ToolBar from "components/toolbar/ToolBar";
import Lading from "components/Lading";
import TasksListWrap from "components/TasksListWrap";

export default function ReactView({
	source,
	sourcePath,
	metadataChangeEvent,
	indexReadyEvent,
}: {
	source: string;
	sourcePath: string;
	metadataChangeEvent: (handle: () => void) => void;
	indexReadyEvent: (handle: () => void) => void;
}) {
	const dv = getDataviewAPI();
	const input = inputValidation(source);
	const [isLoading, setIsLoading] = useState(dv.index.initialized);
	const [pages, setPages] = useState((isLoading)? dv.pages(input.pages) :[]);
	const pageData = usePage(pages, input);
	useEffect(() => {
		let data = pages;
		// 필터링
		if (
			pageData.pagesFiltering &&
			pageData.selectFilterValue &&
			pageData.selectFilterValue?.length !== 0
		) {
			data = pageData.pagesFiltering(data, pageData.selectFilterValue);
		}
		// 검색
		if (pageData.searchValue !== "") {
			data = pageData.pagesSearching(data, pageData.searchValue);
		}

		pageData.setRendererPages(data);
	}, [pages]);
	
	useEffect(() => {
		if (isLoading) {
			metadataChangeEvent(() => {
				setPages(dv.pages(input.pages));
			});
		} else {
			indexReadyEvent(() => {
				setIsLoading(true);
				setPages(dv.pages(input.pages));
			});
		}
	}, []);

	return (
		<>
			{!isLoading ? (
				<Lading />
			) : (
				<>
					<PagesDataContext.Provider value={pageData}>
						<ToolBar input={input} />
						<div className={`page-table-wrapper ${input.cls}`}>
							<Table
								pages={pageData.pageSlice()}
								rows={input.rows}
								sourcePath={sourcePath}
							/>
						</div>
						{input.options &&
							input.options.includes("tasksView") &&
							pages.length !== 0 && (
								<TasksListWrap pages={pages} />
							)}
					</PagesDataContext.Provider>
				</>
			)}
		</>
	);
}
