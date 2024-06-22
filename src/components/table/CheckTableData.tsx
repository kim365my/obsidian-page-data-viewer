import React from 'react';
import { getFileRealLink } from 'Utils/getFileRealLink';
import { CheckRawList } from "./CheckRawList";
import { isImageEmbed } from "./CheckRawList";
import { DataObject, STask } from "obsidian-dataview";

export default React.memo(CheckTableData);

function CheckTableData({
	page,
	row,
	sourcePath,
}: {
	page: DataObject;
	row: string;
	sourcePath: string;
}) {
	let relativeTime = false;
	if (row.startsWith("rTime_")) {
		relativeTime = true;
		const startNum = row.indexOf("rTime_") + 6;
		row = row.slice(startNum, row.length);
	}

	if (row.contains("file.")) {
		const fileType = row.replace("file.", "").trim();
		const file = page.file[fileType];
		let cls;
		switch (fileType) {
			case "tasks":
				if (file.length !== 0) {
					const completedTasks = file.filter((t: STask) => t.completed);
					const progress = Math.round((completedTasks.length / file.length || 0) * 100);
		
					return (
						<span>
							<progress value={progress} max="100"></progress>
							&nbsp;
							<span>{progress}%</span>
						</span>
					);
				} else {
					return <span>No tasks</span>
				}
			case "name":
			case "link":
				cls = "file-title";
		}
		return <CheckRawList value={file} sourcePath={sourcePath} inline={false} relativeTime={relativeTime} cls={cls} />;
	}

	return <CheckRawList value={page[row]} sourcePath={sourcePath} inline={false} relativeTime={relativeTime} />;
}

export function PageCoverUrl({page}:{page: DataObject}) {
	let src = "";

	switch (typeof page.cover_url) {
		case "string":
			// 페이지 cover_url이 웹 이미지를 불러오는 형식이라면
			src = page.cover_url;
			break;
		case "object":
			// 페이지 cover_url이 옵시디언 내부 이미지를 불러오는 방식이라면
			src = getFileRealLink(page.cover_url.path);
			break;
		default:
			// page가 null인 경우, 문서 내부의 첫번째 이미지에서 불러오기
			for (const item of page.file.outlinks.values) {
				if (isImageEmbed(item)) {
					if (String(item.path).startsWith("http")) {
						src = item.path;
					} else {
						src = getFileRealLink(item.path);
					}
					break;
				}
			}
	}

	return (
		<>
			{src !== "" && (
				<a
					data-tooltip-position="top"
					aria-label={page.file.name}
					data-href={page.file.name}
					href={page.file.link.path}
					className="internal-link"
					target="_blank"
					rel="noopener"
				>
					<img src={src} />
				</a>
			)}
		</>
	);
}
