/*
* dictionary with auto-intake
* */
export class AutoDict<T> {
    items: { key: string, value: T }[] = [];
    find(key: string, defaultVal: T = null) {
        let it = this.items.find(it => it.key == key);
        if (it) {
            return {found: true, item: it};
        } else {
            if (defaultVal) {
                let newItem = {key: key, value: defaultVal};
                this.items.push((newItem));
                return {found: false, item: newItem};
            } else {
                return {found: false, item: null};
            }
        }
    }
}

/*
* array with auto-intake
* */
export class AutoNumArray {
    items: string[] = [];
    findIndex(val: string) {
        let index = this.items.findIndex(it => it == val);
        if (index == -1) {
            this.items.push(val);
            return this.items.length - 1;
        } else return index;
    }
}

/*
* uuid
* */
export function uuid() {
    let d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
