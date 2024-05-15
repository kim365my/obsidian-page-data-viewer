import { DataviewFile } from "interface/DataviewFile";
import CheckTableData from "./CheckTableData";
import React from "react";

function Table({
	pages,
	rows,
	type,
}: {
	pages: DataviewFile[];
	rows: string[];
	type?: "csv";
}) {
	return (
		<>
			<table className="dataview table-view-table">
				<thead className="table-view-thead">
					<tr className="table-view-tr-header">
						{rows.map((row: string, index: number) => (
							<th
								className="table-view-th"
								key={"tableRow" + index}
							>
								<span>{row}</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody className="table-view-tbody">
					{pages.map((page, index: number) => (
						<tr key={"tr" + index}>
							{rows.map((row, index: number) => (
								<td key={"td" + index}>
									<CheckTableData
										page={page}
										row={row}
										type={type}
									/>
								</td>
							))}
						</tr>
					))}
				</tbody>
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
export default React.memo(Table);
