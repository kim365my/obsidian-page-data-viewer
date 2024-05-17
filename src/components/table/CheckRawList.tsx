import getDataviewAPI from "API/Dataview";
import { Literal, Link } from "obsidian-dataview";
import { getFileRealLink } from "Utils/getFileRealLink";
import { Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef } from "react";
import { MarkdownRenderer } from "obsidian";
import { usePlugin } from "context/PluginContext";
import { renderMinimalDate, currentLocale, renderMinimalDuration } from "../../Utils/renderDate";

function RawMarkdown({ sourcePath, content, inline = true, cls }: {
    content: string;
	sourcePath: string;
    inline?: boolean;
    cls?: string;
}) {
    const container = useRef<HTMLElement | null>(null);
	const plugin = usePlugin();

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = "";

		MarkdownRenderer.render(plugin.app, content, container.current, sourcePath, plugin).then(() => {
			if (!container.current || !inline) return;

            // Unwrap any created paragraph elements if we are inline.
            let paragraph = container.current.querySelector("p");
            while (paragraph) {
                const children = paragraph.childNodes;
                paragraph.replaceWith(...Array.from(children));
                paragraph = container.current.querySelector("p");
            }
		})
    }, [content, sourcePath, container.current]);

    return <span ref={container} className={cls}></span>;
}

export const Markdown = React.memo(RawMarkdown);

function RawEmbedHtml({ element }: { element: HTMLElement; }) {
    const container = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = "";
        container.current.appendChild(element);
    }, [container.current, element]);

    return <span ref={container}></span>;
}
export const EmbedHtml = React.memo(RawEmbedHtml);


function CheckForRaw({
	value,
	inline = true,
	sourcePath,
}: {
	value: Literal;
	inline: boolean;
	sourcePath: string;
}) {
	const dv = getDataviewAPI();

	if (dv.value.isNull(value) || value === undefined) {
		return <>{dv.settings.renderNullAs}</>;
	} else if (dv.value.isString(value) || typeof value === "string") {
		return <Markdown content={value} sourcePath={sourcePath} />;
	} else if (dv.value.isNumber(value) || dv.value.isBoolean(value)) {
		return <>{"" + value}</>;
	} else if (dv.value.isDate(value)) {
		return <>{renderMinimalDate(value, dv.settings, currentLocale())}</>;
	} else if (dv.value.isDuration(value)) {
		return <>{renderMinimalDuration(value)}</>;
	} else if (dv.value.isLink(value)) {
		if (isImageEmbed(value)) {
			const fileRealLink = getFileRealLink(value.path);
			return (
				<span>
					<img src={fileRealLink}></img>
				</span>
			);
		}
		return <Markdown content={value.markdown()} sourcePath={sourcePath} />;
	} else if (dv.value.isHtml(value)) {
		return <EmbedHtml element={value} />;
	} else if (dv.value.isWidget(value)) {
		if (dv.widgets.isListPair(value)) {
			return (
				<Fragment>
					<CheckRawList value={value.key} sourcePath={sourcePath} inline={inline} />:{" "}
					<CheckRawList value={value.value} sourcePath={sourcePath} inline={inline} />
				</Fragment>
			);
		} else if (dv.widgets.isExternalLink(value)) {
			return (
				<a
					href={value.url}
					rel="noopener"
					target="_blank"
					className="external-link"
				>
					{value.display ?? value.url}
				</a>
			);
		} else {
			return <b>&lt;unknown widget '{value.$widget}'&gt;</b>;
		}
	} else if (dv.value.isFunction(value)) {
        return <Fragment>&lt;function&gt;</Fragment>;
	} else if (dv.value.isArray(value)) {
		if (!inline) {
            return (
                <ul className={"dataview dataview-ul dataview-result-list-ul"}>
                    {value.map((subValue: Literal, index: number) => (
                        <li className="dataview-result-list-li"  key={"key" + String(subValue) + index} >
                            <CheckRawList value={subValue} sourcePath={sourcePath} inline={inline} />
                        </li>
                    ))}
                </ul>
            );
        } else {
			if (value.length == 0) return <Fragment>&lt;Empty List&gt;</Fragment>;

			return (
				<span className="dataview dataview-result-list-span">
					{value.map((subValue: Literal, index: number) => (
						<Fragment key={"subValue" + String(subValue) + index}>
							{index === 0 ? "" : ", "}
							<CheckRawList value={subValue} sourcePath={sourcePath} inline={inline} />
						</Fragment>
					))}
				</span>
			);
		}
	} else if (dv.value.isObject(value)) {
		if (value?.constructor?.name && value?.constructor?.name != "Object") {
			return <>&lt;{value.constructor.name}&gt;</>;
		}
		if (!inline) {
            return (
                <ul className="dataview dataview-ul dataview-result-object-ul">
                    {Object.entries(value).map(([key, value], index) => (
                        <li className="dataview dataview-li dataview-result-object-li" key={"key" + key + index} >
                            {key}: <CheckRawList value={value} sourcePath={sourcePath} inline={inline} />
                        </li>
                    ))}
                </ul>
            );
        } else {
			if (Object.keys(value).length == 0) return <Fragment>&lt;Empty Object&gt;</Fragment>;
			return (
				<span className="dataview dataview-result-object-span">
					{Object.entries(value).map(([key, value], index) => (
						<Fragment key={"dataview" + String(key) + index}>
							{index == 0 ? "" : ", "}
							{key}: <CheckRawList value={value} sourcePath={sourcePath} inline={inline} />
						</Fragment>
					))}
				</span>
			);
		}
	}
	return <>{dv.settings.renderNullAs}</>;
}

export const CheckRawList = React.memo(CheckForRaw);

const IMAGE_EXTENSIONS = Object.freeze(
	new Set([
		".tif",
		".tiff",
		".gif",
		".png",
		".apng",
		".avif",
		".jpg",
		".jpeg",
		".jfif",
		".pjepg",
		".pjp",
		".svg",
		".webp",
		".bmp",
		".ico",
		".cur",
	])
);

export function isImageEmbed(link: Link): boolean {
	if (!link.path.contains(".")) return false;

	const extension = link.path.substring(link.path.lastIndexOf("."));
	return link.type == "file" && link.embed && IMAGE_EXTENSIONS.has(extension);
}


