import Table from "components/table/Table";
import { PagesDataContext } from "context/PagesDataContext";
import { usePage } from "hooks/usePage";
import inputValidation from "validation/inputValidation";
import { useEffect, useState } from "react";
import getDataviewAPI from "API/Dataview";
import ToolBar from "components/toolbar/ToolBar";
import Lading from "components/Lading";
import { MarkdownPostProcessorContext } from "obsidian";

export default function ReactView({
	source,
	ctx,
	metadataChangeEvent,
}: {
	source: string;
	ctx: MarkdownPostProcessorContext;
	metadataChangeEvent: (handle: () => void) => void;
}) {
	const dv = getDataviewAPI();
	const input = inputValidation(source);
	const [isLoading, setIsLoading] = useState(true);
	const [pages, setPages] = useState(dv.pages(input.pages));
	const pageData = usePage(pages, input);

	useEffect(() => {
		metadataChangeEvent(() => {
			const data = dv.pages(input.pages);
			setPages(data);
		});
	}, []);

	useEffect(() => {
		let data = pages;
		// 검색
		if (pageData.searchValue !== "") {
			data = pageData.pagesSearching(data, pageData.searchValue);
		}
		// 필터링
		if (
			pageData.pagesFiltering &&
			pageData.selectFilterValue &&
			pageData.selectFilterValue?.length !== 0
		) {
			data = pageData?.pagesFiltering(data, pageData?.selectFilterValue);
		}
		pageData.setRendererPages(data);

		if (isLoading) {
			setIsLoading(false);
		}
	}, [pages]);

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
