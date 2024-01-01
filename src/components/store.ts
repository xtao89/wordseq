// @ts-ignore
import {ref, watch} from "vue"
import {DocImp} from "../core/docImp"
import {SeqDef, SeqDefTemplate} from "../core/seq"

//app options shared across components
export const options = ref({
    showTip: true
})
const readOptions = async () => {
    let content = {key: 'options', value: null}
    await DocImp.current.setting('read', content)  //load from doc settings
    let loaded = content.value
    if (loaded) {
        Reflect.ownKeys(loaded).forEach(key => options.value[key] = loaded[key]) //overwrite the default
        console.log(`options loaded: ${JSON.stringify(options.value)}`)
    }
    //set up a watcher, save options when it changes
    watch(options.value, async () => {
        await DocImp.current.setting('write', {key: 'options', value: options.value})
        console.log(`options saved: ${JSON.stringify(options.value)}`)
    })
}
readOptions().then(_ => {})

/*
* reactives shared across components
* */
export const store = ref({
    restartForMark: 0,
    fieldNumberForMark: 1,
    seqDefItems: SeqDef.items,
    bannerMessage: '', //message banner
})
const readDefItems = async () => {
    let content = {key: 'defItems', value: null}
    await DocImp.current.setting('read', content) //load from doc setting
    let loaded = content.value
    if (Array.isArray(loaded)) {
        loaded.forEach(obj => {
            Reflect.setPrototypeOf(obj, SeqDef.prototype) //set prototype for the deserialized plain object
            Reflect.setPrototypeOf(obj.template, SeqDefTemplate.prototype)
            store.value.seqDefItems.push(obj)
        })
        console.log(`${store.value.seqDefItems.length} def items loaded`)
    }
    watch(store.value.seqDefItems, async () => {
        await DocImp.current.setting('write', {key: 'defItems', value: store.value.seqDefItems})
        console.log(`${store.value.seqDefItems.length} def items saved`)
    })
}
readDefItems().then(_ => { if (store.value.seqDefItems.length == 0) { addDefaultDefs() }})
function addDefaultDefs() {
    store.value.seqDefItems.push(
        new SeqDef('T1', 'T1', 'first-level title, as Chapter 1, 2, 3...', 'Chapter {}\x20'),
        new SeqDef('T2', 'T2', 'second-level title, as x.1, 2, 3...where x is T1 number', '{T1}.{}\x20', [], ['T1']),
        new SeqDef('T3', 'T3', 'third-level title, as x.y.1, 2, 3...where x is T1 number, y is T2 number', '{T1}.{T2}.{}\x20', [], ['T1','T2']),

        new SeqDef('Figure', 'Figure', 'Figure 1, 2, 3...', 'Figure {}'),
        new SeqDef('Table', 'Table', 'Table 1, 2, 3...', 'Table {}'),
        new SeqDef('Formula', 'Formula', 'Formula 1, 2, 3...', 'Formula {}'),

        new SeqDef('Figure_T1', 'Figure_T1', 'Fig.x-1, 2, 3...where x is T1 number', 'Fig.{T1}-{}', [], ['T1']),
        new SeqDef('Table_T1', 'Table_T1', 'Tab.x-1, 2, 3...where x is T1 number', 'Tab.{T1}-{}', [], ['T1']),

        new SeqDef('Bracket', 'Bracket', 'bracket numbers, (1), (2), (3)...', '({})\x20'),
        new SeqDef('Roman', 'Roman', 'Roman numbers, Ⅰ., Ⅱ., Ⅲ...', '{#}.\x20', ['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ'])
    )
}

