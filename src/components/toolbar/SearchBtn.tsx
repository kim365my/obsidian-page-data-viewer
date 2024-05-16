export default function SearchBtn() {
	return (
		<div>
			<button
				className="searchBtn clickable-icon"
				aria-label="검색 필터 보기"
			>
				<svg
					className="svg-icon lucide lucide-search"
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
			</button>
		</div>
	);
}
