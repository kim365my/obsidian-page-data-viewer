import { PagesDataContext } from "context/PagesDataContext";
import { useEffect, useState } from "react";
import { DataviewFile } from "interface/DataviewFile";
import useCsvPage from "hooks/useCsvPage";
import csvInputValidation from "validation/csvInputValidation";
import getDataviewAPI from "API/Dataview";
import ToolBar from "components/toolbar/ToolBar";
import Table from "components/table/Table";
import Lading from "components/Lading";

export default function CsvTableView({ source }: { source: string }) {
	const dv = getDataviewAPI();
	const input = csvInputValidation(source);
	const [isLoading, setIsLoading] = useState(true);
	const [pages, setPages] = useState([] as DataviewFile[]);
	const pageData = useCsvPage(pages, input);
	useEffect(() => {
		dv.io.csv(input.pages).then((csv: DataviewFile[]) => {
			if (csv.length !== 0) {
				setPages(csv);
				// 검색
				if (pageData.searchValue !== "") {
					csv = pageData.pagesSearching(csv, pageData.searchValue);
				}
				pageData.setRendererPages(csv);
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
						<Table pages={pageData.pagesSlice()} rows={input.rows} type="csv" />
					</>
			}		
		</PagesDataContext.Provider>
	);
}
