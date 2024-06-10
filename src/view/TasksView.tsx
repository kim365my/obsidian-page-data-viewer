import getDataviewAPI from "API/Dataview";
import Lading from "components/Lading";
import TasksListWrap from "components/TasksListWrap";
import { parseYaml } from "obsidian";
import { useEffect, useState } from "react";

export default function TasksView({
	source,
	sourcePath,
	metadataChangeEvent,
	indexReadyEvent
}: {
	source: string;
	sourcePath: string;
	metadataChangeEvent: (handle: () => void) => void;
	indexReadyEvent: (handle: () => void) => void;
}) {
	const dv = getDataviewAPI();
	const input = parseYaml(source);
	const [isLoading, setIsLoading] = useState(dv.index.initialized);
	const [pages, setPages] = useState((isLoading) ? ((input.pages) ? dv.pages(input.pages) : dv.page(sourcePath)) : []);

	useEffect(() => {
		if (isLoading) {
			metadataChangeEvent(() => {
				const data = (input.pages) ? dv.pages(input.pages) : dv.page(sourcePath);
				setPages(data);
			});
		} else {
			indexReadyEvent(() => {
				setIsLoading(true);
				const data = (input.pages) ? dv.pages(input.pages) : dv.page(sourcePath);
				setPages(data);
			})
		}
	}, []);

	return <>{!isLoading ? <Lading /> : <TasksListWrap pages={pages} />}</>;
}


