import { DataArray, DataObject } from "obsidian-dataview";
import React, { useState } from "react";
import { Platform } from "obsidian";
import MenuModal from "./MenuModal";
import { usePagesData } from "context/PagesDataContext";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

export default function FilterList({pages, property}: {pages: DataArray<DataObject>, property: string}) {
	const { handleFilterList } = usePagesData();

	const data = pages[property];
	const setList = new Set(data);
	const list = Array.from(setList).map(item => String(item)).sort();
	const filter = ["모두보기", ...list] as string[];

	const [visible, setVisible] = useState(false);
	const [selectBtnValue, setSelectBtnValue] = useState(0);
	const isMobile = Platform.isPhone;


	const handleClick = () => {		
		if (isMobile) {
			MenuModal(filter).then((selected) => {
				if (handleFilterList && typeof selected === "string")
					handleFilterList(property, selected);
			})
		} else {
			setVisible(!visible);
		}
	}

	return (
		<div
			className={(selectBtnValue === 0) ? "box filter-list" : "box filter-list selected"}
			onClick={handleClick}
			onBlur={() => setVisible(false)}
			tabIndex={0}
		>
			<button
				className="filteringBtn clickable-icon nav-action-button collapse-icon"
				aria-label={property + " 필터 보기"}
			>
				<div className="filter-list-title">{property}</div>
				<div className="filter-list-title-icon">
					{visible ? (
						<ChevronUp className="svg-icon" />
					) : (
						<ChevronDown className="svg-icon" />
					)}
				</div>
				{visible && (
					<div className="menu mod-no-icon">
						{filter.map((item, index: number) => (
							<React.Fragment key={"ListItem" + index}>
								<div
									className={
										(selectBtnValue === index)
											? "menu-item mod-checked"
											: "menu-item tappable"
									}
									data-index={index}
									onMouseDown={(e) => e.preventDefault()}
									onClick={() => {
										setSelectBtnValue(index);
										if (handleFilterList) handleFilterList(property, item)
									}}
								>
									<div className="menu-item-icon"></div>
									<div className="menu-item-title">{item}</div>
									{selectBtnValue === index && (
										<div className="menu-item-icon mod-checked">
											<Check className="svg-icon" />
										</div>
									)}
								</div>
							</React.Fragment>
						))}
					</div>
				)}
			</button>
		</div>
	);
}

