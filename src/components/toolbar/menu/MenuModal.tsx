import { filter, sort } from "interface/pageData";
import { FuzzySuggestModal } from "obsidian";

export default function MenuModal(values: filter[] | sort[] | string[]) {
    const data = new Promise((resolve, reject) => {
        this.MySuggestModal = class extends FuzzySuggestModal<filter | sort | string>{
            getItems() {
                return values
            }
            getItemText(val: filter | sort | string) {
                return (typeof val === "string")? val :val.label;
            }
            onChooseItem(val: filter | sort, event: MouseEvent | KeyboardEvent) {
                resolve(val)
            }
        }
        new this.MySuggestModal(this.app).open();
    });
    return data;
}
