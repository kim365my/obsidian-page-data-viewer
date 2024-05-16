import MyPlugin from "main";
import { createContext, useContext } from "react";

export const PluginContext = createContext<MyPlugin | null>(null);
export const usePlugin = (): MyPlugin => {
    const pluginContext = useContext(PluginContext);
    if (!pluginContext) {
		throw new Error("pluginContext has to be used within <pluginContext.Provider>");
    }
    return pluginContext;
}