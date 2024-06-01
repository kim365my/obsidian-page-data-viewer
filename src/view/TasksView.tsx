import getDataviewAPI from "API/Dataview";
import Lading from "components/Lading";
import TasksListWrap from "components/TasksListWrap";
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
	const [isLoading, setIsLoading] = useState(dv.index.initialized);
	const [pages, setPages] = useState((isLoading) ? ((source !== "") ? dv.pages(source) : dv.page(sourcePath)) : []);

	useEffect(() => {
		if (isLoading) {
			metadataChangeEvent(() => {
				const data = (source !== "") ? dv.pages(source) : dv.page(sourcePath);
				setPages(data);
			});
		} else {
			indexReadyEvent(() => {
				setIsLoading(true);
				const data = (source !== "") ? dv.pages(source) : dv.page(sourcePath);
				setPages(data);
			})
		}
	}, []);

	return <>{!isLoading ? <Lading /> : <TasksListWrap pages={pages} />}</>;
}


