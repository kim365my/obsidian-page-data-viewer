import { DataviewFile } from "interface/DataviewFile";
import CheckTableData from "./CheckTableData";
import TableThead from "./TableThead";
import { useTransition } from "react";


export default function Table({
	pages, rows, type,
}: {
	pages: DataviewFile[];
	rows: string[];
	type?: "csv";
}) {

	const [isPending, startTransition] = useTransition();

	const Tbody = <tbody className="table-view-tbody">
		{pages.map((page, index: number) => (
			<tr key={"tr" + index}>
				{rows.map((row, index: number) => (
					<td key={"td" + index}>
						<CheckTableData
							page={page}
							row={row}
							type={type} />
					</td>
				))}
			</tr>
		))}
	</tbody>;
	return (
		<>
			<table className="dataview table-view-table">
				<TableThead rows={rows} />
				{Tbody}
			</table>
			{pages.length === 0 && (
				<div className="dataview dataview-error-box">
					<p className="dataview dataview-error-message">
						Dataview: No results to show for table query.
					</p>
				</div>
			)}
		</>
	);
}
