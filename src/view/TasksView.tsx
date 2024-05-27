import getDataviewAPI from "API/Dataview";
import Lading from "components/Lading";
import CircleProgress from "components/progress/CircleProgress";
import { CheckRawList, Markdown } from "components/table/CheckRawList";
import { usePlugin } from "context/PluginContext";
import useTaskList from "hooks/useTaskList";
import { MarkdownPostProcessorContext, Platform, Vault } from "obsidian";
import { DataArray, DataObject, STask } from "obsidian-dataview";
import { useEffect, useState } from "react";

export default function TasksView({
	source,
	ctx,
	metadataChangeEvent,
	indexReadyEvent
}: {
	source: string;
	ctx: MarkdownPostProcessorContext;
	metadataChangeEvent: (handle: () => void) => void;
	indexReadyEvent: (handle: () => void) => void;
}) {
	const dv = getDataviewAPI();
	const [isLoading, setIsLoading] = useState(dv.index.initialized);
	const [pages, setPages] = useState((isLoading) ? dv.page(ctx.sourcePath) : []);

	useEffect(() => {
		if (isLoading) {
			metadataChangeEvent(() => {
				setPages(dv.page(ctx.sourcePath));
			});
		} else {
			indexReadyEvent(() => {
				setIsLoading(true);
				setPages(dv.page(ctx.sourcePath));
			})
		}
	}, []);

	return <>{!isLoading ? <Lading /> : <TaskListWrap pages={pages} source={source} sourcePath={ctx.sourcePath} />}</>;
}

function TaskListWrap({
	pages,
	source,
	sourcePath,
}: {
	pages: DataArray<DataObject>;
	source: string;
	sourcePath: string;
}) {
	const { tasks, progress, rTasks, groupTasks } = useTaskList(pages);

	return (
		<>
			<div className="tasksListWrap">
				<CircleProgress
					progressWidth={120}
					strokeWidth={5}
					progress={progress}
				/>
				<TaskList
					tasks={tasks}
					rTasks={rTasks}
					groupTasks={groupTasks}
				/>
			</div>
			{source !== "" && (
				<>
					<hr />
					<Markdown content={source} sourcePath={sourcePath} />
				</>
			)}
		</>
	);
}

function TaskList({
	tasks,
	rTasks,
	groupTasks,
}: {
	tasks: DataArray<STask>;
	rTasks: DataArray<STask>;
	groupTasks: Array<STask>;
}) {
	return (
		<div className="taskList">
			<h4>
				<span>Task List</span>
				<span className="dataview small-text">{rTasks.length}</span>
			</h4>
			{tasks.length === 0 ? (
				<p>No tasks</p>
			) : (
				rTasks.length === 0 && <p>할 일을 모두 마쳤습니다.</p>
			)}
			{Object.values(groupTasks).map((tasks: STask, index: number) => (
				<div key={"tasksList" + index}>
					{Object.values(groupTasks).length !== 1 && (
						<h5>
							<span>{Object.keys(groupTasks)[index]}</span>
							<span className="dataview small-text">
								{tasks.length}
							</span>
						</h5>
					)}
					<ul className={"contains-task-list"}>
						{tasks.map((task: STask, index: number) => (
							<Tasks key={"task" + index} task={task} />
						))}
					</ul>
				</div>
			))}
		</div>
	);
}

function Tasks({ task }: { task: STask }) {
	const plugin = usePlugin();

	const handleClick = (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		if (wasLinkPressed(evt)) {
			return;
		}

		evt.stopPropagation();
		const selectionState = {
			eState: {
				cursor: {
					from: { line: task.line, ch: task.position.start.col },
					to: {
						line: task.line + task.lineCount - 1,
						ch: task.position.end.col,
					},
				},
				line: task.line,
			},
		};
		plugin.app.workspace.openLinkText(
			task.link.toFile().obsidianLink(),
			task.path,
			evt.ctrlKey || (evt.metaKey && Platform.isMacOS),
			selectionState as any
		);
	};
	const handleChecked = (
		evt: React.MouseEvent<HTMLInputElement, MouseEvent>
	) => {
		evt.stopPropagation();
		const completed = evt.currentTarget.checked;
		const status = completed ? "x" : " ";
		// Update data-task on the parent element (css style)
		const parent = evt.currentTarget.parentElement;
		parent?.setAttribute("data-task", status);

		rewriteTask(plugin.app.vault, task, status, task.text);
	};
	return (
		<li
			className={
				"dataview task-list-item" + (task.checked ? " is-checked" : "")
			}
			data-task={task.status}
			onClick={handleClick}
		>
			<input
				type="checkbox"
				defaultChecked={task.checked}
				className="dataview task-list-item-checkbox"
				onClick={handleChecked}
			></input>
			<CheckRawList
				inline={true}
				value={task.visual ?? task.text}
				sourcePath={task.path}
			/>
		</li>
	);
}

function wasLinkPressed(
	evt: React.MouseEvent<HTMLLIElement, MouseEvent>
): boolean {
	return (
		evt.target != null &&
		evt.target != undefined &&
		(evt.target as HTMLElement).tagName == "A"
	);
}
const LIST_ITEM_REGEX =
	/^[\s>]*(\d+\.|\d+\)|\*|-|\+)\s*(\[.{0,1}\])?\s*(.*)$/mu;

/** Rewrite a task with the given completion status and new text. */
async function rewriteTask(
	vault: Vault,
	task: STask,
	desiredStatus: string,
	desiredText?: string
) {
	if (
		desiredStatus == task.status &&
		(desiredText == undefined || desiredText == task.text)
	)
		return;
	desiredStatus = desiredStatus == "" ? " " : desiredStatus;

	const rawFiletext = await vault.adapter.read(task.path);
	const hasRN = rawFiletext.contains("\r");
	const filetext = rawFiletext.split(/\r?\n/u);

	if (filetext.length < task.line) return;
	const match = LIST_ITEM_REGEX.exec(filetext[task.line]);
	if (!match || match[2].length == 0) return;

	const taskTextParts = task.text.split("\n");
	if (taskTextParts[0].trim() != match[3].trim()) return;

	// We have a positive match here at this point, so go ahead and do the rewrite of the status.
	const initialSpacing = /^[\s>]*/u.exec(filetext[task.line])!![0];
	if (desiredText) {
		const desiredParts = desiredText.split("\n");

		const newTextLines: string[] = [
			`${initialSpacing}${task.symbol} [${desiredStatus}] ${desiredParts[0]}`,
		].concat(desiredParts.slice(1).map((l) => initialSpacing + "\t" + l));

		filetext.splice(task.line, task.lineCount, ...newTextLines);
	} else {
		filetext[task.line] = `${initialSpacing}${
			task.symbol
		} [${desiredStatus}] ${taskTextParts[0].trim()}`;
	}

	const newText = filetext.join(hasRN ? "\r\n" : "\n");
	await vault.adapter.write(task.path, newText);
}
