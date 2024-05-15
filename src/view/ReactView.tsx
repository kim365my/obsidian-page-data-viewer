import Table from "components/table/Table";
import { PagesDataContext } from "context/PagesDataContext";
import { usePage } from "hooks/usePage";
import inputValidation from "validation/inputValidation";
import { useEffect, useState } from "react";
import getDataviewAPI from "API/Dataview";
import ToolBar from "components/toolbar/ToolBar";
import Lading from "components/Lading";

export default function ReactView({
	source,
	metadataChangeEvent,
}: {
	source: string;
	metadataChangeEvent: (handle: () => void) => void;
}) {
	const dv = getDataviewAPI();
	const input = inputValidation(source);
	const [isLoading, setIsLoading] = useState(true);
	const [pages, setPages] = useState(dv.pages(input.pages));
	const pageData = usePage(pages, input);
	useEffect(() => {
		metadataChangeEvent(() => {
			let data = dv.pages(input.pages);
			if (data.length !== 0) {
				setPages(data);

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
					data = pageData?.pagesFiltering(
						data,
						pageData?.selectFilterValue
					);
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
			{isLoading
				? <Lading />
				: 
				<>				
					<ToolBar input={input} />
					<Table pages={pageData.pagesSlice()} rows={input.rows} />
				</>
				}
		</PagesDataContext.Provider>
	);
}
