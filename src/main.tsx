import { MarkdownPostProcessorContext, Plugin } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import CsvTableView from "view/CsvTableView";
import ReactView from "view/ReactView";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "components/ErrorPage";
import { PluginContext } from "context/PluginContext";
import TasksView from "view/TasksView";

export default class MyPlugin extends Plugin {
	root: Root | null = null;

	async onload() {
		const metadataChangeEvent = (handle: () => void) => {
			this.registerEvent(this.app.metadataCache.on("dataview:metadata-change", handle));
		}
		const indexReadyEvent = (handle: () => void) => {
			this.registerEvent(this.app.metadataCache.on("dataview:index-ready", handle));
		}
		this.registerMarkdownCodeBlockProcessor("page-table", (source, el, ctx) => {				
			this.handleTableView(source, el, ctx);
			this.root = createRoot(el);
			this.root.render(
				<ErrorBoundary FallbackComponent={ErrorPage}>
					<PluginContext.Provider value={this}>
						<ReactView
							source={source}
							sourcePath={ctx.sourcePath}
							metadataChangeEvent={metadataChangeEvent}
							indexReadyEvent={indexReadyEvent}
						></ReactView>
					</PluginContext.Provider>
				</ErrorBoundary>
			); 
		});

		this.registerMarkdownCodeBlockProcessor("page-tasks", (source, el, ctx) => {
			this.handleTableView(source, el, ctx);
			this.root = createRoot(el);
			this.root.render(
				<ErrorBoundary FallbackComponent={ErrorPage}>
					<PluginContext.Provider value={this}>
						<TasksView
							source={source}
							sourcePath={ctx.sourcePath}
							metadataChangeEvent={metadataChangeEvent}
							indexReadyEvent={indexReadyEvent}
						></TasksView>
					</PluginContext.Provider>
				</ErrorBoundary>
			);
		})

		this.registerMarkdownCodeBlockProcessor("page-table-csv", (source, el, ctx) => {
			this.handleTableView(source, el, ctx);
			this.root = createRoot(el);
			this.root.render(
				<ErrorBoundary FallbackComponent={ErrorPage}>
					<PluginContext.Provider value={this}>
						<CsvTableView source={source} sourcePath={ctx.sourcePath}></CsvTableView>
					</PluginContext.Provider>
				</ErrorBoundary>
			);
		});

	}

	async onClose() {
		this.root?.unmount();
	}

	handleTableView(source:string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		if (!ctx.sourcePath) return;
		el.onClickEvent((event: MouseEvent) => {
			event.preventDefault();
		});
	}

}
