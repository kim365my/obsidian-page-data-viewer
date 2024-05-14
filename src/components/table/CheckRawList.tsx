import getDataviewAPI from "API/Dataview";
import { getFileRealLink } from "Utils/getFileRealLink";
import { Link, Literal } from "interface/DataviewFile";
import { AUDIO_EXTENSIONS, IMAGE_EXTENSIONS } from "interface/EXTENSIONS";
import { Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef } from "react";
import { DateTime, Duration } from "luxon";
import { marked } from "marked";

export function RawMarkdown({ content, inline = true, cls }: {
    content: string;
    inline?: boolean;
    cls?: string;
}) {
    const container = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = "";
        if (content) {
            const html = (inline) ? marked.parseInline(content) : marked.parse(content);
            if (typeof html === "string") {
                container.current.innerHTML = html;
            }
        }
    }, [content]);

    return <span ref={container} className={cls}></span>;
}

export const Markdown = React.memo(RawMarkdown);

export function RawEmbedHtml({ element }: { element: HTMLElement; }) {
    const container = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = "";
        container.current.appendChild(element);
    }, [container.current, element]);

    return <span ref={container}></span>;
}
export const EmbedHtml = React.memo(RawEmbedHtml);


export function CheckForRaw({ value }: { value: Literal; }) {
	const dv = getDataviewAPI();

	if (dv.value.isNull(value) || value === undefined) {
		return <>{dv.settings.renderNullAs}</>;
	} else if (dv.value.isString(value) || typeof value === "string") {
		const imgRegex = new RegExp(/!\[\[(.*?)\]\]/g);
		if (imgRegex.test(value)) {
			// 이미지 파일
			const extension = value.substring(
				value.indexOf("."),
				value.indexOf("]]")
			);
			if (IMAGE_EXTENSIONS.has(extension)) {
				const imgStartIndex = value.indexOf("![[");
				const imgEndIndex = value.indexOf(
					value.includes("|") ? "|" : "]]"
				);
				const imgText = value.substring(imgStartIndex + 3, imgEndIndex);
				const fileRealLink = getFileRealLink(imgText);
				value = value.replace(imgRegex, `<img src=${fileRealLink}/>`);
			}
		}

		const linkRegex = new RegExp(/\[\[(.*)(\|.*)?\]\]/g);
		if (linkRegex.test(value)) {
			const linkStartIndex = value.indexOf("[[");
			const linkEndIndex = value.indexOf(
				value.includes("|") ? "|" : "]]"
			);
			const linkText = value.substring(linkStartIndex + 2, linkEndIndex);

			value = value.replace(
				linkRegex,
				`<a data-tooltip-position="top" aria-label="${linkText}" data-href="${linkText}" href="${linkText}" class="internal-link" target="_blank" rel="noopener">${linkText}</a>`
			);
		}

		const urlLinkRegex = new RegExp(/\[(.*?)\]\((.*?)\)/g);
		if (urlLinkRegex.test(value)) {
			value = value.replace(
				urlLinkRegex,
				`<a data-tooltip-position="top" aria-label="$2" data-href="$2" href="$2" class="external-link" target="_blank" rel="noopener">$1</a>`
			);
		}

		return <Markdown content={value} />;
	} else if (dv.value.isNumber(value) || dv.value.isBoolean(value)) {
		return <>{"" + value}</>;
	} else if (dv.value.isDate(value)) {
        return <>{renderMinimalDate(value, dv.settings, currentLocale())}</>
    } else if (dv.value.isDuration(value)) {
       return <>{renderMinimalDuration(value)}</>
	} else if (dv.value.isLink(value)) {
		if (isImageEmbed(value)) {
			const fileRealLink = getFileRealLink(value.path);
			return (
				<span>
					<img src={fileRealLink}></img>
				</span>
			);
		} else if (isAudioEmbed(value)) {
			const fileRealLink = getFileRealLink(value.path);
			return (
				<span className="internal-embed media-embed audio-embed is-loaded">
					<audio
						controls={true}
						controlsList="nodownload"
						src={fileRealLink}
					></audio>
				</span>
			);
		} else if (value.type === "file") {
			return (
				<a
					data-tooltip-position="top"
					aria-label={value.fileName()}
					data-href={value.fileName()}
					href={value.path}
					className="internal-link"
					target="_blank"
					rel="noopener"
				>
					{value.fileName()}
				</a>
			);
		}
        return <Markdown content={value.markdown()} />;
    } else if (dv.value.isHtml(value)) {
		return <EmbedHtml element={value} />;
    } else if (dv.value.isWidget(value)) {
        if (dv.widgets.isListPair(value)) {
            return (
                <Fragment>
                    <CheckRawList value={value.key} />:{" "}
                    <CheckRawList value={value.value} />
                </Fragment>
            );
        } else if (dv.widgets.isExternalLink(value)) {
            return (
                <a href={value.url} rel="noopener" target="_blank" className="external-link">
                    {value.display ?? value.url}
                </a>
            );
        } else {
            return <b>&lt;unknown widget '{value.$widget}'&gt;</b>;
        }
	} else if (dv.value.isArray(value)) {
        if (value.length == 0) return <Fragment>&lt;Empty List&gt;</Fragment>;

        return (
            <span className="dataview dataview-result-list-span">
                {value.map((subValue: Literal, index: number) => (
                    <Fragment key={"subValue" + String(subValue) + index}>
                        {index === 0 ? "" : ", "}
                        <CheckRawList value={subValue} />
                    </Fragment>
                ))}
            </span>
        );
	} else if (dv.value.isObject(value)) {
		if (value?.constructor?.name && value?.constructor?.name != "Object") {
			return <>&lt;{value.constructor.name}&gt;</>;
		}
		return (
			<span className="dataview dataview-result-object-span">
				{Object.entries(value).map(([key, value], index) => (
					<Fragment key={"dataview" + String(key) + index}>
						{index == 0 ? "" : ", "}
						{key}: <CheckRawList value={value} />
					</Fragment>
				))}
			</span>
		);
	}
	return <>{dv.settings.renderNullAs}</>;
}

export const CheckRawList = React.memo(CheckForRaw);

export function isImageEmbed(link: Link): boolean {
    if (!link.path.contains(".")) return false;

    const extension = link.path.substring(link.path.lastIndexOf("."));
    return link.type == "file" && link.embed && IMAGE_EXTENSIONS.has(extension);
}

export function isAudioEmbed(link: Link): boolean {
    if (!link.path.contains(".")) return false;

    const extension = link.path.substring(link.path.lastIndexOf("."));
    return link.type == "file" && link.embed && AUDIO_EXTENSIONS.has(extension);
}
/** Normalize a duration to all of the proper units. */
export function normalizeDuration(dur: Duration) {
    if (dur === undefined || dur === null) return dur;

    return dur.shiftToAll().normalize();
}

/** Render a DateTime in a minimal format to save space. */
export function renderMinimalDate(time: DateTime, setting: Literal, locale: string): string {
    // If there is no relevant time specified, fall back to just rendering the date.
    if (time.second == 0 && time.minute == 0 && time.hour == 0) {
        return time.toLocal().toFormat(setting?.defaultDateFormat, { locale });
    }

    return time.toLocal().toFormat(setting?.defaultDateTimeFormat, { locale });
}

/** Render a duration in a minimal format to save space. */
export function renderMinimalDuration(dur: Duration): string {
    dur = normalizeDuration(dur);

    // toHuman outputs zero quantities e.g. "0 seconds"
    dur = Duration.fromObject(
        Object.fromEntries(Object.entries(dur.toObject()).filter(([, quantity]) => quantity != 0))
    );

    return dur.toHuman();
}

/** Test-environment-friendly function which fetches the current system locale. */
export function currentLocale(): string {
    if (typeof window === "undefined") return "en-US";
    return window.navigator.language;
}