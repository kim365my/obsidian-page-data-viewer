import { DataObject, DataArray, STask } from "obsidian-dataview";

export default function useTaskList(pages: DataArray<DataObject>) {
	const tasks = pages?.file?.tasks;
	const completedTasks = tasks?.filter((t: STask) => t.completed);
	const progress = Math.round(
		(completedTasks?.length / tasks?.length || 0) * 100
	);
	// grouping
	const rTasks = tasks?.filter((t: STask) => !t.completed);
	const groupTasks = rTasks?.values.reduce(
		(group: Array<STask>, task: STask) => {
			const { path } = task;
			if (group[path]) {
				group[path].push(task);
			} else group[path] = [task];
			return group;
		},
		{}
	);

	return { tasks, progress, rTasks, groupTasks };
}

