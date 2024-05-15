import { DataviewFile, Literal } from 'interface/DataviewFile'
import { getFileRealLink } from 'Utils/getFileRealLink';
import { CheckRawList } from "./CheckRawList";
import { isImageEmbed } from "./CheckRawList";
import { Markdown } from "./CheckRawList";
import getDataviewAPI from 'API/Dataview';
import React from 'react';

export default React.memo(CheckTableData);

function CheckTableData({
	page,
	row,
	type
}: {
	page: DataviewFile;
	row: string;
	type?: "csv"
}) {
	const dv = getDataviewAPI();
	const value = page[row];

	if (type) {
		const file = String(value);
		if (file.contains("\\,")) {
			// 다중 정보가 저장되어 있는 경우
			const content = file.split("\\,");
			return (
				<>
					{content.map((data, index: number) => (
						<CheckRawList
							key={"data" + data + index}
							value={dv.parse(data)}
						/>
					))}
				</>
			);
		}
	} else {
		if (row.contains("file.")) {
			const fileType = row.replace("file.", "");
			return (
				<PageFileRender
					page={page}
					fileType={fileType}
					pageData={value}
				/>
			);
		} else if (row === "cover_url") {
			return pageCoverUrl(page);
		}
	}
	return <CheckRawList value={value} />;
}

function PageFileRender({page, fileType, pageData} : {
	page: DataviewFile
	fileType: string
	pageData: Literal
}) {

    switch (fileType) {
        case "tasks":
            // eslint-disable-next-line no-case-declarations
            const tasks = page.file.tasks;
            if (tasks.length !== 0) {
                const completedTasks = tasks.filter(t => t.completed);
                const value = Math.round((completedTasks.length / tasks.length || 0) * 100);

                return (
					<span>
						<progress value={value} max="100"></progress>&nbsp;
						<span>{value}%</span>
					</span>
				);
            } else {
				return <span>No tasks</span>
			}
        case "link":
            return <CheckRawList value={page.file.link} />
        default:
			return <Markdown content={pageData} />
    }
}
function pageCoverUrl(page: DataviewFile) {
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
					src = getFileRealLink(item.path);
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
