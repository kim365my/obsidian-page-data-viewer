import { DataArray, DataObject } from "obsidian-dataview";
import React, { useState } from "react";
import { Platform } from "obsidian";
import MenuModal from "./MenuModal";
import { usePagesData } from "context/PagesDataContext";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import dvType from "Utils/dvType";
import { Literal } from "obsidian-dataview";
import { linkFileToText } from "Utils/getFileRealLink";
import getDataviewAPI from "API/Dataview";
import { filterList } from "interface/pageData";
import { currentLocale, renderMinimalDate, renderMinimalDuration } from "Utils/renderDate";

export default function FilterList({pages, property}: {pages: DataArray<DataObject>, property: string}) {
	const { handleFilterList } = usePagesData();

	const data = pages[property];
	const dv = getDataviewAPI();
	const setList = new Set(data);
	const itemList: filterList[] = [{label: "모두보기", content: "", type: "default"}];
	Array.from(setList).forEach((item: Literal) => {
		const type = dvType(item);
		let label = "";
		switch (type) {
			case "link":
				label = linkFileToText(String(item.path));
				break;
			case "date":
				label = renderMinimalDate(item, dv.settings, currentLocale());
				break;
			case "duration":
				label = renderMinimalDuration(item);
				break;
			default:
				label = String(item);
		}

		itemList.push({
			content: String(item),
			label: label,
			type: type,
		});
	});

	const filterList = itemList.filter((obj, idx) => {
		const isFirstFindIdx = itemList.findIndex((obj2) => obj2.label === obj.label);
		return isFirstFindIdx === idx;
	}).sort((a,b) => {
		if (a.label === "모두보기" || b.label === "모두보기") return 0;
		if(a.content > b.content) return -1;
		if(a.content < b.content) return 1;
		return 0;
	});
	
	const [visible, setVisible] = useState(false);
	const [selectBtnValue, setSelectBtnValue] = useState(0);

	const handleClick = () => {		
		const isMobile = Platform.isPhone;
		if (isMobile) {
			MenuModal(filterList).then((selected: filterList) => {
				if (handleFilterList) handleFilterList(property, selected);
			})
		} else {
			setVisible(!visible);
		}
	}

	return (
		<div
			className={
				selectBtnValue === 0
					? "box filter-list"
					: "box filter-list selected"
			}
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
						{filterList.map((item, index: number) => (
							<ListItem
								key={"ListItem" + index}
								data={data}
								item={item}
								index={index}
								property={property}
								selectBtnValue={selectBtnValue}
								setSelectBtnValue={setSelectBtnValue}
							/>
						))}
					</div>
				)}
			</button>
		</div>
	);
}

function ListItem({
	item,
	index,
	property,
	selectBtnValue,
	setSelectBtnValue,
}: {
	data: DataArray<DataObject>;
	item: filterList;
	index: number;
	property: string;
	selectBtnValue: number;
	setSelectBtnValue: React.Dispatch<React.SetStateAction<number>>;
}) {
	const { handleFilterList, filterListItemLength } = usePagesData();

	return (
		<div
			className={
				selectBtnValue === index
					? "menu-item mod-checked"
					: "menu-item tappable"
			}
			data-index={index}
			onMouseDown={(e) => e.preventDefault()}
			onClick={() => {
				setSelectBtnValue(index);
				if (handleFilterList) handleFilterList(property, item);
			}}
		>
			<div className="menu-item-icon"></div>
			<div className="menu-item-title">{item.label}</div>
			<span>({filterListItemLength && filterListItemLength(property, item)})</span>
			{selectBtnValue === index && (
				<div className="menu-item-icon mod-checked">
					<Check className="svg-icon" />
				</div>
			)}
		</div>
	);
}