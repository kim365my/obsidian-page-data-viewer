import React from "react";

function TableThead({rows}: {rows:string[]}) {
	return (
		<thead className="table-view-thead">
			<tr className="table-view-tr-header">
				{rows.map((row: string, index: number) => (
					<th className="table-view-th" key={"tableRow" + index}>
						<span>{row}</span>
					</th>
				))}
			</tr>
		</thead>
	);
}

export default React.memo(TableThead);