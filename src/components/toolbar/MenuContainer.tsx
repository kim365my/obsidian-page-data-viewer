import { filter, sort } from "interface/pageData";
import React from "react";

export function MenuContainer({ list, selectBtnValue, clickHandle, useSeparator }: {
	list: filter[] | sort[] | string[]
	selectBtnValue : number[]
	clickHandle: (arg: number) => void
	useSeparator: boolean
}) {
	return (
		<div className="menu">
			{list.map((item, index: number) => (
				<React.Fragment key={"ListItem" + index}>
					<div
						className={
							selectBtnValue.includes(index)
								? "menu-item mod-checked"
								: "menu-item"
						}
						data-index={index}
						onMouseDown={(e) => e.preventDefault()}
						onClick={() => clickHandle(index)}
					>
						<div className="menu-item-title">
							{typeof item === "string" ? item : item.label}
						</div>
						{selectBtnValue.includes(index) && (
							<div className="menu-item-icon mod-checked">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="svg-icon lucide-check"
								>
									<path d="M20 6 9 17l-5-5"></path>
								</svg>
							</div>
						)}
					</div>
					{useSeparator && index % 2 !== 0 && (
						<div className="menu-separator"></div>
					)}
				</React.Fragment>
			))}
		</div>
	);
}
