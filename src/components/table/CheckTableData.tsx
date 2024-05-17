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
	const value = page[row];

	if (row.contains("file.")) {
		const fileType = row.replace("file.", "");
		if (fileType === "tasks") {
			const tasks = page.file.tasks;
			if (tasks.length !== 0) {
				const completedTasks = tasks.filter((t: STask) => t.completed);
				const progress = Math.round((completedTasks.length / tasks.length || 0) * 100);
	
				return (
					<span>
						<progress value={progress} max="100"></progress>&nbsp;
						<span>{progress}%</span>
					</span>
				);
			} else {
				return <span>No tasks</span>
			}
		}
		return <CheckRawList value={page.file[fileType]} sourcePath={sourcePath} inline={false} />
	} else if (row === "cover_url") {
		return pageCoverUrl(page);
	}

	return <CheckRawList value={value} sourcePath={sourcePath} inline={false} />;
}

function pageCoverUrl(page: DataObject) {
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
						src = item.path
					} else {
						src = getFileRealLink(item.path);
					}
					break;
				}
			}
	}
	if (src && src !== "") {
		return (
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
		);
	}

	return <></>
}
