///<reference path="../node_modules/@types/office-js/index.d.ts" />

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
    }
});

class functions {
    @register
    insert(document: Word.Document): void {
        document.body.insertParagraph(`Office has several versions`, Word.InsertLocation.start);
    }
}

function register(target: any, propertyKey: string, descriptor: any) {
    let original = descriptor.value;
    descriptor.value = function (event: Office.AddinCommands.Event) {
        Word.run(async (context) => {
            try {
                Reflect.apply(original, this, [context.document]);
            } catch (e) {
                console.log(e);
            }
            await context.sync();
        });
        event.completed(); // Be sure to indicate when the add-in command function is complete
    }
    Office.actions.associate(propertyKey, descriptor.value); // You must register the function.

}