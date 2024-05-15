import { usePagesData } from "context/PagesDataContext";
import React from "react";

function Search() {
	const { searchValue, handleSearch, handleSearchInit } = usePagesData();
	return (
		<div className="search-input-container">
			<input
				className="textSearch"
				type="search"
				enterKeyHint="search"
				spellCheck={false}
				placeholder="입력하여 검색 시작..."
				value={searchValue}
				onChange={(e) => {
					setInterval(() => {
						handleSearch(e.target.value.toLowerCase().trim());
					}, 1000)
				}}
			/>
			<div
				className="search-input-clear-button"
				onClick={handleSearchInit}
			></div>
		</div>
	);
}
export default React.memo(Search);