import { Pos } from 'obsidian';
import { DateTime } from 'luxon';
import { Literal } from "obsidian-dataview";

export interface Link {
    path: string;
    display: string;
    subpath: string;
    embed: boolean;
    type: "file" | "header" | "block";
}
export interface Task {
    status: string;
    checked: boolean;
    completed: boolean;
    fullyCompleted: boolean;
}
export interface ListItem {
    symbol: string;
    link: Link;
    section: Link;
    text: string;
    line: number;
    lineCount: number;
    list: number;
    links: Link[];
    tags: Set<string>;
    position: Pos;
    parent?: number;
    children: number[];
    blockId?: string;
    fields: Map<string, Literal[]>;
    task?: Task;
}
export interface DataviewFile {
    ctime: DateTime;
    mtime: DateTime;
    name: string;
    path: string;
    file: File;
    size: number;
    folder: string;
    links: Link[];
    lists: ListItem[];
    inlinks: Link[];
    title?: string;
    tags: Set<string>;
    aliases: Set<string>;
    [key: string]: Literal;
}
export interface File {
    aliases: Set<string>,
    cday: DateTime,
    ctime: DateTime,
    mday: DateTime,
    mtime: DateTime,
    etags: object,
    ext: string,
    folder: string,
    frontmatter: object,
    link: Link,
    inlinks: Link[],
    links: Link[],
    lists: object,
    name: string,
    outlinks: Literal,
    path: string,
    size: number,
    starred: boolean,
    tags: Set<string>,
    tasks: Task[],
    [key: string]: Literal;
}