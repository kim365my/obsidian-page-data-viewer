
export function getFileRealLink(value: string) {
    const realFile = this.app.metadataCache.getFirstLinkpathDest(value, "");
    if (!realFile) {
        console.log(value, "미디어 파일을 불러오는 데 실패했습니다.")
        return null;
    }
    const resourcePath = this.app.vault.getResourcePath(realFile);
    return resourcePath;
}
