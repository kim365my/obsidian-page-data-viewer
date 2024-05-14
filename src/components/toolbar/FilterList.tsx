import { filter } from "interface/pageData";
import { usePagesData } from "context/PagesDataContext";

export default function FilterList({ filter }: { filter: filter[] }) {
	const { selectFilterValue, deleteFilter } = usePagesData();
	return (
		<div className="filter-showing-box">
			{selectFilterValue && selectFilterValue.length !== 0 && (
				<>
					<span className="filter-tip">Filter</span>
					{selectFilterValue.map((select) => deleteFilter && (
						<button
							key={"selectFilterItem" + select}
							className="clickable-icon filter-item"
							data-index={select}
							onClick={(e) =>
								deleteFilter(
									Number(e.currentTarget.dataset.index)
								)
							}
						>
							{filter[select].label}
						</button>
					))}
				</>
			)}
		</div>
	);
}
