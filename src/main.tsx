import { Plugin } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import CsvTableView from "view/CsvTableView";
import ReactView from "view/ReactView";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "components/ErrorPage";
import { PluginContext } from "context/PluginContext";

export default class MyPlugin extends Plugin {
	root: Root | null = null;

	async onload() {
		const handleClick = (event: MouseEvent) => {
			event.preventDefault();
		}
		const metadataChangeEvent = (handle: () => void) => {
			this.registerEvent(this.app.metadataCache.on("dataview:metadata-change", handle));
		}
		this.registerEvent(this.app.metadataCache.on("dataview:index-ready", () => {
			this.registerMarkdownCodeBlockProcessor("page-table", (source, el, ctx) => {				
				if (!ctx.sourcePath) return;
				el.onClickEvent(handleClick);
				
				this.root = createRoot(el);
				this.root.render(
					<ErrorBoundary FallbackComponent={ErrorPage}>
						<PluginContext.Provider value={this}>
							<ReactView source={source} ctx={ctx} metadataChangeEvent={metadataChangeEvent}></ReactView>
						</PluginContext.Provider>
					</ErrorBoundary>
				);
			});
		}));

		this.registerMarkdownCodeBlockProcessor("page-table-csv", (source, el, ctx) => {
			if (!ctx.sourcePath) return;
			el.onClickEvent(handleClick);
			this.root = createRoot(el);
			this.root.render(
				<ErrorBoundary FallbackComponent={ErrorPage}>
					<PluginContext.Provider value={this}>
						<CsvTableView source={source} ctx={ctx}></CsvTableView>
					</PluginContext.Provider>
				</ErrorBoundary>
			);
		});

	}

	async onClose() {
		this.root?.unmount();
	}

}
