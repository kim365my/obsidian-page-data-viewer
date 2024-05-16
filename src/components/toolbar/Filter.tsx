import { useState } from "react";
import { MenuContainer } from "./MenuContainer";
import { filter } from "interface/pageData";
import { usePagesData } from "context/PagesDataContext";
import Modal from "./Modal";


export default function Filter({filter, isMobile}: {filter: filter[], isMobile: boolean}) {
	const { selectFilterValue, handleFilter } = usePagesData();
	const [visible, setVisible] = useState(false);
	const handleClick = () => {
		if (isMobile) {
			Modal(filter).then((selected) => {
				const index = filter.findIndex((item) => item === selected);
				if (handleFilter) handleFilter(index);
			})
		} else {
			setVisible(!visible)
		}
	}
	return (
		<div className="box" onClick={handleClick} onBlur={() => setVisible(false)} tabIndex={0}>
			<button
				className="filteringBtn clickable-icon nav-action-button"
				aria-label="필터 보기"
			>
				<svg
					className="svg-icon lucide-filter"
					strokeLinejoin="round"
					strokeLinecap="round"
					strokeWidth="2"
					stroke="currentColor"
					fill="none"
					viewBox="0 0 24 24"
					height="24"
					width="24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
				</svg>
				{visible && selectFilterValue && handleFilter && (
					<MenuContainer
						list={filter}
						selectBtnValue={selectFilterValue}
						clickHandle={handleFilter}
						useSeparator={false}
					></MenuContainer>
				)}
			</button>
		</div>
	);
}

