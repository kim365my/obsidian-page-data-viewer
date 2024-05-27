import { useState } from "react";
import { MenuContainer } from "./MenuContainer";
import { sort } from "interface/pageData";
import { usePagesData } from "context/PagesDataContext";
import Modal from "./Modal";
import { ArrowUpDown } from "lucide-react";

export default function SortBtn({sort, isMobile}: {sort: sort[], isMobile: boolean}) {
	const { selectSortNum, handleSort } = usePagesData();
	const [visible, setVisible] = useState(false);

	const handleClick = () => {
		if (isMobile) {
			Modal(sort).then((selected) => {
				const index = sort.findIndex((item) => item === selected);
				handleSort(index);
			})
		} else {
			setVisible(!visible)
		}
	}
	
	return (
		<div className="box" onClick={handleClick} onBlur={() => setVisible(false)} tabIndex={0}>
			<button
				className="clickable-icon nav-action-button"
				aria-label="정렬 순서 변경"
			>
				<ArrowUpDown className="svg-icon" />
			</button>
			{visible && (
				<MenuContainer
					list={sort}
					selectBtnValue={[selectSortNum]}
					clickHandle={handleSort}
					useSeparator={true}
				></MenuContainer>
			)}
		</div>
	);
}
