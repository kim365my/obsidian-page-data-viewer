import { useState } from "react";
import { MenuContainer } from "./MenuContainer";
import { filter } from "interface/pageData";
import { usePagesData } from "context/PagesDataContext";
import Modal from "./Modal";
import { FilterIcon } from "lucide-react";


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
				<FilterIcon className="svg-icon" />
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

