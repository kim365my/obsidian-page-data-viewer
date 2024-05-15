import { Plugin } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import CsvTableView from "view/CsvTableView";
import ReactView from "view/ReactView";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "components/ErrorPage";

export default class MyPlugin extends Plugin {
	root: Root | null = null;

	async onload() {
		
		const metadataChangeEvent = (handle: () => void) => {
			this.registerEvent(this.app.metadataCache.on("dataview:metadata-change", handle));
		}
		this.registerEvent(this.app.metadataCache.on("dataview:index-ready", () => {
			this.registerMarkdownCodeBlockProcessor("page-table", (source, el, ctx) => {
				this.root = createRoot(el);
				this.root.render(
					<ErrorBoundary FallbackComponent={ErrorPage}>
						<ReactView source={source} metadataChangeEvent={metadataChangeEvent}></ReactView>
					</ErrorBoundary>
				);
			});
		}));

		this.registerMarkdownCodeBlockProcessor("page-table-csv", (source, el, ctx) => {
				this.root = createRoot(el); 
				this.root.render(
					<ErrorBoundary FallbackComponent={ErrorPage}>
						<CsvTableView source={source}></CsvTableView>
					</ErrorBoundary>
				);
			}
		);
	}

	async onClose() {
		this.root?.unmount();
	}

}
