import { App } from 'obsidian';
import { getAPI, isPluginEnabled, DataviewApi } from 'obsidian-dataview'

export default function getDataviewAPI(): DataviewApi {
    if (!isPluginEnabled(this.app as App)) {
        throw new Error("Could not access Dataview API")        
    }

    const api = getAPI(this.app);
    if (api) return api;
}