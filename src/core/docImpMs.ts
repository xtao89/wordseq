///<reference path="../../node_modules/@types/office-js/index.d.ts" />
import {DocImp} from "./docImp"

Office.onReady((info) => {
    if (info.host == Office.HostType.Word) {
        console.log("office word hosted.");
        //console.log(navigator.userAgent);
    }
});

/**
 * MS Office implementation using content controls
 */
export class DocImpMscc extends DocImp {
    constructor() {
        super();
    }
    override get name(): string {
        return "ms-doc-content-controls";
    }
    override async mark(signature: string, data: string, text: string) {
        await Word.run(async (context) => {
            let selRange = context.document.getSelection();
            let cc = selRange.insertContentControl(Word.ContentControlType.richText);
            cc.insertText(text, Word.InsertLocation.replace);
            cc.set({title: signature, tag: data}); //data in tag, signature in title
            await context.sync();
        });
    }
    override async traverse(signature: string, handler: (data: string, originalText: string) => string) {
        await Word.run(async (context) => {
            let ccc = signature ? context.document.body.contentControls.getByTitle(signature).load("items") :
                context.document.body.contentControls.load("items");
            await context.sync();

            for (let cc of ccc.items) {
                cc.load(['tag', 'text']); //data in tag
                await context.sync();

                let text = handler(cc.tag, cc.text);
                if (text) {
                    cc.insertText(`${text}`, Word.InsertLocation.replace);
                }
            }
        });
    }
    override async setting(action: "read" | "write", content: { key: string, value: any }) {
        //use document settings to store settings
        await Word.run(async (context) => {
            if (action == 'read') {
                let setting = context.document.settings.getItemOrNullObject(content.key).load()
                await context.sync()
                content.value = !setting.isNullObject ? setting.value : null
            } else if (action == 'write') {
                context.document.settings.add(content.key, content.value)
            }
        })
    }
    override async test() {
        await Word.run(async (context) => {
            // Queue commands add a setting.
            const settings = context.document.settings;
            //settings.add('startMonth', { month: 'March', year: 1998 });

            // Queue commands to retrieve settings.
            const startMonth = settings.getItemOrNullObject('startMonth');
            const endMonth = settings.getItemOrNullObject('endMonth');

            // Queue commands to load settings.
            startMonth.load();
            endMonth.load();

            // Synchronize the document state by executing the queued commands,
            // and return a promise to indicate task completion.
            await context.sync();
            if (startMonth.isNullObject) {
                console.log("No such setting.");
            } else {
                console.log(JSON.stringify(startMonth.value));
            }
            if (endMonth.isNullObject) {
                console.log("No such setting.");
            } else {
                console.log(JSON.stringify(endMonth.value));
            }
        });
    }
}

/**
 * MS Office implementation using fields
 */
export class DocImpMsf extends DocImp {
    constructor() {
        super();
    }
    override get name(): string {
        return "ms-doc-fields";
    }
    override async mark(title: string, data: string, text: string) {
        await Word.run(async (context) => {
            let selRange = context.document.getSelection();
            let field = selRange.insertField(
                Word.InsertLocation.start,
                Word.FieldType.addin
            );
            field.set({data: data});
            field.result.insertText(text, Word.InsertLocation.replace);
            await context.sync();
        });
    }
    override async traverse(title: string, handler: (data: string, text: string) => string) {
        let fc: Word.FieldCollection;
        await Word.run(async (context) => {
            fc = context.document.body.fields.load("items");
            await context.sync();

            for (let f of fc.items) {
                f.load(['data', 'result']);
                await context.sync();

                let text = handler(f.data, f.result.text);
                if (text) {
                    f.result.insertText(text, Word.InsertLocation.replace);
                }
            }
        });
    }
    override async setting(action: "read" | "write", content: { key: string; value: any }) {
        return DocImpMscc.prototype.setting.apply(this, arguments)
    }
    override async test() {
        await Word.run(async (context) => {
            let f = context.document.getSelection().insertField(Word.InsertLocation.start, Word.FieldType.addin);
            f.result.insertText('***', Word.InsertLocation.replace); //can not set result text for an addin field ???
            await context.sync();
            console.log(`can not set result text for an addin field: ${f.result.text}`);
        });
    }
}
