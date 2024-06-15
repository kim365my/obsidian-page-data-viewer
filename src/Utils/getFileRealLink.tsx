export function getRealFile(value: string) {
    const realFile = this.app.metadataCache.getFirstLinkpathDest(value, "");
    return realFile;
}


export function getFileRealLink(value: string) {
    const realFile = getRealFile(value);
    if (!realFile) {
        console.log(value, "미디어 파일을 불러오는 데 실패했습니다.")
        return null;
    }
    const resourcePath = this.app.vault.getResourcePath(realFile);
    return resourcePath;
}

export function getFileRelativePath(value: string) {
    if (!value.startsWith("#")) {
        const filePath = this.app.workspace.getActiveFile();
        const parent = filePath?.parent;
        if (value.startsWith("./")) {
            const parentPath = parent?.path;
            value = replacePath(value, parentPath);
        } else if (value.startsWith("../")) {
            const grandParent = parent?.parent?.path;
            value = replacePath(value, grandParent);
        }
        value = `"${value}"`
    }
    return value;
}

function replacePath(value: string, path: string) {
    const endString = (value.endsWith("/")) ? "" : "/";
    const result = value.replace(/^\.\//, !(path === "/") ? (path + endString): "");
    return result;
}