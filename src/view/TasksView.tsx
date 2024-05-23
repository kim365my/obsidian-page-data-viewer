import getDataviewAPI from "API/Dataview";
import CircleProgress from "components/CircleProgress";
import { MarkdownPostProcessorContext } from "obsidian";
import { STask } from "obsidian-dataview";
import { useEffect, useState } from "react";

export default function TasksView({
	source,
	ctx,
	metadataChangeEvent,
}: {
	source: string;
	ctx: MarkdownPostProcessorContext;
	metadataChangeEvent: (handle: () => void) => void;
}) {
	const dv = getDataviewAPI();
	const [page, setPage] = useState(dv.page(ctx.sourcePath));
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		metadataChangeEvent(() => {
			const data = dv.page(ctx.sourcePath);
			setPage(data);
		});
	}, []);
	useEffect(() => {
		const tasks = page.file.tasks;
		const completedTasks = tasks.filter((t: STask) => t.completed);
		const progress = Math.round(
			(completedTasks.length / tasks.length || 0) * 100
		);
		setProgress(progress);
		console.log(progress);
	}, [page]);

	return (
		<CircleProgress
			progressWidth={120}
			strokeWidth={5}
			progress={progress}
		/>
	);
}
