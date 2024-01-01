<script lang="ts" setup>
import {PropType, computed, onMounted, onUnmounted, ref, watch} from 'vue'
import {SeqDef, SeqDefLookup, SeqDefTemplate} from "../core/seq";
import {store} from './store'

const selDefName = ref('')
const cloned = ref(new SeqDef('NAME', 'ALIAS', 'DESCRIPTION'))
watch(selDefName, () => {store.value.seqDefItems.find(it => it.name == selDefName.value)?.copyTo(cloned.value)})

const nameRepr = computed({
  get: () => cloned.value.name,
  set: (val: string) => cloned.value.name = /^\w+$/.test(val) ? val : 'NAME_letters_digits_underscore_allowed'
})
const templateRepr = computed({
  get: () => cloned.value.template.toString(),
  set: (val) => cloned.value.template = SeqDefTemplate.fromString(val)
})
const alternativesRepr = computed({
  get: () => cloned.value.alternatives.join(','),
  set: (val: string) => { cloned.value.alternatives = val.split(',').map(s => s.trim()).filter(s => s !== '') }
})
const recountersRepr = computed({
  get: () => cloned.value.recounters.join(','),
  set: (val: string) => { cloned.value.recounters = val.split(',').map(s => s.trim()).filter(s => s !== '') }
})

function addDef() {
  let def = store.value.seqDefItems.find(def => def.name == cloned.value.name)
  if (def) { cloned.value.copyTo(def) } else { store.value.seqDefItems.push(cloned.value)}
  store.value.bannerMessage = `"${cloned.value.name}" ${def ? 'updated' : 'added'}.`
}
</script>

<template>
  <select v-model="selDefName" class="form-select text-center" name="defNames">
    <option value="">> choose a sequence</option>
    <template v-for="def in store.seqDefItems">
      <option :value="def.name">{{ def.name }}</option>
    </template>
  </select>

  <div class="form-floating mt-1">
    <input v-model.lazy="nameRepr" type="text" class="form-control" id="name" placeholder="name"/>
    <label for="name">Name</label>
  </div>
  <div class="form-floating mt-1">
    <input v-model.lazy="cloned.alias" type="text" class="form-control" id="alias" placeholder="alias"/>
    <label for="alias">Alias</label>
  </div>
  <div class="form-floating mt-1">
    <input v-model.lazy="cloned.description" type="text" class="form-control" id="description" placeholder="description"/>
    <label for="description">Description</label>
  </div>
  <div class="form-floating mt-1">
    <input v-model.lazy="templateRepr" type="text" class="form-control" id="template" placeholder="template"/>
    <label for="template">Template</label>
  </div>
  <div class="form-floating mt-1">
    <input v-model.lazy="alternativesRepr" type="text" class="form-control" id="alternatives" placeholder="alternatives"/>
    <label for="alternatives">Alternatives</label>
  </div>
  <div class="form-floating mt-1">
    <input v-model.lazy="recountersRepr" type="text" class="form-control" id="recounts" placeholder="recounts"/>
    <label for="recounts">Recounts</label>
  </div>
<!--  <div class="form-check form-switch mt-3">-->
<!--    <input class="form-check-input" type='checkbox' id='remembered' v-model='cloned.remembered'>-->
<!--    <label for="remembered">remembered</label>-->
<!--  </div>-->

  <div class="btn-group mt-3 w-100">
    <button class='btn btn-secondary form-control' @click="addDef">Add</button>
  </div>
</template>
