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
        if (value.startsWith("./")) {
            const filePath = this.app.workspace.getActiveFile();
            const parentPath = filePath?.parent?.path;
            const isBase = (parentPath === "/");
            value = value.replace(/^\.\//, !isBase ? (parentPath + "/"): "");
        }
        value = `"${value}"`
    }
    return value;
}