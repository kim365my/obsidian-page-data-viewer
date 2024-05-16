import { filter, sort } from "interface/pageData";
import { FuzzySuggestModal } from "obsidian";

export default function Modal(values: filter[] | sort[]) {
    const data = new Promise((resolve, reject) => {
        this.MySuggestModal = class extends FuzzySuggestModal<filter | sort>{
            getItems() {
                return values
            }
            getItemText(val: filter | sort) {
                return val.label;
            }
            onChooseItem(val: filter | sort, event: MouseEvent | KeyboardEvent) {
                resolve(val)
            }
        }
        new this.MySuggestModal(this.app).open();
    });
    return data;
}
