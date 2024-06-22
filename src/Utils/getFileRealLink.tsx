export function getRealFile(value: string) {
    const realFile = this.app.metadataCache.getFirstLinkpathDest(value, "");
    return realFile;
}


export function getFileRealLink(value: string) {
    const realFile = getRealFile(value);
    if (!realFile) {
        console.log(value, "미디어 파일을 불러오는 데 실패했습니다.");
        return null;
    }
    const resourcePath = this.app.vault.getResourcePath(realFile);
    return resourcePath;
}

export function getFileRelativePath(value: string) {
    if (!value.startsWith("#")) {
        const filePath = this.app.workspace.getActiveFile();
        const parent = filePath?.parent;
        if (value.includes("../")) {
            const grandParent = parent?.parent?.path;
            value = replacePath(value, "../", grandParent);
        } else if (value.includes("./")) {
            const parentPath = parent?.path;
            value = replacePath(value, "./", parentPath);
        }
        value = `"${value}"`
    }
    return value;
}

function replacePath(value: string, replaceWord: string, path: string) {
    const endString = (value.endsWith("/")) ? "" : "/";
    const result = value.replace(replaceWord, !(path === "/") ? (path + endString): "");
    return result;
}