import Table from "components/table/Table";
import { PagesDataContext } from "context/PagesDataContext";
import { usePage } from "hooks/usePage";
import inputValidation from "validation/inputValidation";
import { useEffect, useState } from "react";
import getDataviewAPI from "API/Dataview";
import ToolBar from "components/toolbar/ToolBar";
import Lading from "components/Lading";
import { MarkdownPostProcessorContext } from "obsidian";
import pageData from "interface/pageData";
import { DataArray, DataObject } from "obsidian-dataview";

export default function ReactView({
	source,
	ctx,
	metadataChangeEvent,
	indexReadyEvent,
}: {
	source: string;
	ctx: MarkdownPostProcessorContext;
	metadataChangeEvent: (handle: () => void) => void;
	indexReadyEvent: (handle: () => void) => void;
}) {
	const dv = getDataviewAPI();
	const input = inputValidation(source);
	const [isLoading, setIsLoading] = useState(dv.index.initialized);
	const [pages, setPages] = useState((isLoading)? dv.pages(input.pages) :[]);

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
				<PagesTable
					input={input}
					pages={pages}
					sourcePath={ctx.sourcePath}
				/>
			)}
		</>
	);
}

function PagesTable({
	input,
	pages,
	sourcePath,
}: {
	input: pageData;
	pages: DataArray<DataObject>;
	sourcePath: string;
}) {
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

	return (
		<PagesDataContext.Provider value={pageData}>
			<ToolBar input={input} />
			<div className={input.cls}>
				<Table
					pages={pageData.pageSlice()}
					rows={input.rows}
					sourcePath={sourcePath}
				/>
			</div>
		</PagesDataContext.Provider>
	);
}
