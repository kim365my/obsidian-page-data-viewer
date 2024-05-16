import { useState } from "react";
import { MenuContainer } from "./MenuContainer";
import { sort } from "interface/pageData";
import { usePagesData } from "context/PagesDataContext";
import Modal from "./Modal";

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
				<svg
					className="svg-icon lucide lucide-arrow-up-down"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="m21 16-4 4-4-4" />
					<path d="M17 20V4" />
					<path d="m3 8 4-4 4 4" />
					<path d="M7 4v16" />
				</svg>
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
