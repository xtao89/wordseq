import {DocImp} from "./docImp";
import {DocImpMscc} from "./docImpMs";
DocImp.current = new DocImpMscc(); //set current docImp

/*
* sequence definition
*/
export class SeqDefLookup {
    lookup: string[][];
    headers: string[];
    private constructor(lookup: string[][], headers: string[]) {
        this.lookup = lookup;
        this.headers = headers;
    }
    headerToFieldIndex(header: string) { return this.headers.findIndex(h => h == header); }
    getItem(nRow: number, nCol: number) {
        if (nRow < 1 || nRow > this.lookup.length) return null;
        let fields = this.lookup[nRow - 1];
        if (nCol < 1 || nCol > fields.length) return null;
        return fields[nCol - 1];
    }
    toText(fieldSeparator: string = '\t') {
        let text = this.headers.length ? this.headers.join(fieldSeparator) + '\n' : '';
        this.lookup.forEach(fields => text += fields.join(fieldSeparator) + '\n');
        return text;
    }
    static fromText(text: string, fieldSeparator: string = '\t', hasHeader: boolean = false) {
        let lookup = [], headers = [];
        text.split(/[\r\n]+/).map(row => row.trim()).filter(row => row).forEach((row, i) => {
            let fields = row.split(fieldSeparator).map(field => field.trim()).filter(field => field);
            if (i == 0 && hasHeader) { headers = fields; } else { lookup.push(fields); }
        });
        return new SeqDefLookup(lookup, headers);
    }
}

export class SeqDefTemplate {
    /* template examples: Figure {#}, Figure {#T1}-{}, {T1}.{T2}.{}
    * {}: current item number
    * {#}: current item represent
    * {defName}: number of the last item with specific def name
    * {#defName}: represent of the last item with specific def name
    *
    * the template string is divided into fragments, plain fragments and named fragments
    * */
    fragments: { name: string, useRepresent?: boolean, content?: string }[] = [];
    private static matcher = /\x7B\s*(#?\w*)\s*\x7D/g;
    private constructor(template: string) {
        let lastEnd = 0;
        let match: RegExpExecArray, matcher = new RegExp(SeqDefTemplate.matcher);
        while ((match = matcher.exec(template)) != null) {
            //collect the preceding plain fragment (maybe empty)
            this.fragments.push({name: null, content: template.substring(lastEnd, match.index)});
            lastEnd = match.index + match[0].length;

            //collect this matched named fragment
            let name = match[1];
            if (name.startsWith('#')) this.fragments.push({name: name.substring(1), useRepresent: true});
            else this.fragments.push({name: name, useRepresent: false});
        }
        this.fragments.push({name: null, content: template.substring(lastEnd)}); //add the last plain frag (maybe empty)
        if (lastEnd == 0) { this.fragments.push({name: '', useRepresent: false}); } //add a default named frag if no match
    }
    toString() {
        return this.fragments.reduce((accumulator, it) => {
            return accumulator += it.name == null ? `${it.content}` :
                `\x7B\x20${it.useRepresent ? '#' : ''}${it.name}\x20\x7D`;
        }, '');
    }
    static fromString(template: string) { return new SeqDefTemplate(template);}
    instantiate(obj: any) {
        return this.fragments.reduce((accumulator, it) => {
            return accumulator += it.name == null ? `${it.content}` : `${obj[it.name]}`;
        }, '');
    }
}

export class SeqDef {
    static items: SeqDef[] = [];
    static getDef = (name: string) => SeqDef.items.find(it => it.name == name);
    static getRecountConcernsOn = (name: string) => SeqDef.items.filter(it => it.recounters.indexOf(name) != -1).map(it => it.name);

    template: SeqDefTemplate;
    constructor(public name: string, public alias: string, public description: string, template: string = '',
        public alternatives: string[] = [], public recounters: string[] = [],
        public remembered: boolean = true, public version: number = 1.0) {
        this.template = SeqDefTemplate.fromString(template);
    }
    getAlternative(num: number) {
        return (num - 1 >= 0 && num - 1 < this.alternatives.length) ? this.alternatives[num - 1] : null
    }
    copyTo(def: SeqDef) {
        def.name = this.name;
        def.alias = this.alias;
        def.description = this.description;
        def.remembered = this.remembered;
        def.version = this.version;
        def.template = SeqDefTemplate.fromString(this.template.toString())
        def.alternatives = Array.from(this.alternatives)
        def.recounters = Array.from(this.recounters)
    }
}

/*
* sequence item with specific id, to be inserted into the doc, or extracted from the doc
*/
export class SeqItem {
    id: string;
    version: number = 1.0;
    constructor(readonly defName: string, readonly restart = 0, readonly fieldNumber: number = 1) {
        this.id = Date.now().toString();
    }
    toString() {return JSON.stringify(this);}
    static fromString(str: string) {
        // the string maybe invalid, in its json format or data structure
        let item: SeqItem = null;
        try {item = str ? (JSON.parse(str) as SeqItem) : null;} catch {}
        if (!item || !item.id || typeof item.version != 'number' ||
            typeof (item.restart) != 'number' || typeof (item.fieldNumber) != 'number' ||
            !SeqDef.getDef(item.defName)) {
            return null;
        }
        // as the item up to present has prototype Object instead of SeqItem...
        Reflect.setPrototypeOf(item, SeqItem.prototype);
        return item;
    }
}

/*
* sequence operation, to update the item text in the doc
*/
export class SeqOperation {
    private numberedItems: { item: SeqItem, num: number }[] = [];
    private counters = {};
    constructor() {
        //init a counter for each seq def
        SeqDef.items.forEach(it => this.counters[it.name] = 1);
    }
    /*
    * collect the item into the list: calculate its num, add it to the list if necessary, and return the index
    * */
    private collectItem(item: SeqItem) {
        //collect the item into the list
        let index = 0;
        let def = SeqDef.getDef(item.defName);
        if (item.restart) { this.counters[item.defName] = 1 }

        if (def.remembered) {
            let i = this.numberedItems.findIndex(record => record.item.id == item.id);
            index = i == -1 ? this.numberedItems.push({item: item, num: this.counters[item.defName]++}) - 1 : i;
        } else {
            index = this.numberedItems.push({item: item, num: this.counters[item.defName]++}) - 1;
        }
        //reset the relevant counters
        SeqDef.getRecountConcernsOn(item.defName).forEach(name => this.counters[name] = 1);
        return index;
    }
    /*
    * find the last item with specific def name
    * */
    private getLastDefItem(uptoIndex: number, defName: string) {
        for (let i = uptoIndex; i >= 0; i--) {
            let rec = this.numberedItems[i];
            if (rec.item.defName == defName) return i;
        }
        return -1;
    }

    async updateItems() {
        let handled = 0, problems = 0;
        await DocImp.current.traverse(SeqOperation.signature, (data, originalText) => {
            let item = SeqItem.fromString(data);
            if (!item) {
                problems++;
                return originalText != '*' ? '*' : null;
            }

            let index = this.collectItem(item); //collect the target item into the list
            // for each variable (def name) in the def template:
            // locate the proper item using the list, and fetch its num or represent
            let obj = {};
            let def = SeqDef.getDef(item.defName);
            def.template.fragments.forEach(it => {
                if (it.name == null) return; //skip plain frags
                let fragDef = it.name ? SeqDef.getDef(it.name) : def;
                let fragIndex = it.name ? this.getLastDefItem(index, it.name) : index; //
                let fragRec = fragIndex >= 0 ? this.numberedItems[fragIndex] : null;
                let fragItem = fragRec?.item;
                let num = fragRec ? fragRec.num : 0;
                let repr = fragDef?.getAlternative(num);
                obj[it.name] = it.useRepresent && repr ? repr : num.toString();
            });
            // get item text by instantiating the def template
            let text = def.template.instantiate(obj);
            if (text != originalText) {
                handled++;
                return text; //set text only when it is different from the original
            } else return null;
        });
        console.log(`problems: ${problems}`);
        return handled;
    }

    static signature = 'WordSeq';
    static async markItem(item: SeqItem, text: string = '*') {
        let data = item.toString();
        await DocImp.current.mark(SeqOperation.signature, data, text);
    }
}



