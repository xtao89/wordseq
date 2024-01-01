<script lang="ts" setup>
import {Ref, computed, ref} from 'vue'
import {DocImp} from '../core/docImp';
import {SeqDef, SeqItem, SeqOperation} from '../core/seq'
import {store, options} from './store'

/////// seq item ////////
async function mark(defName: string) {
  let seqItem = new SeqItem(defName, store.value.restartForMark, store.value.fieldNumberForMark);
  await SeqOperation.markItem(seqItem);
  await update();
  store.value.restartForMark = 0  //restore
  store.value.fieldNumberForMark = 1
}
async function update() {
  let operation = new SeqOperation();
  let handled = await operation.updateItems();
  store.value.bannerMessage = `${handled} item(s) handled.`
}

/////// test ////////
function test() {
  DocImp.current.test();
}

</script>

<template>
  <div class="list-group">
    <div v-for="def in store.seqDefItems" class="list-group-item">
      <div class="col" style="cursor:pointer" @click="mark(def.name)">
        <div class="text-nowrap">
          <a href="javascript:void(0)">{{ def.alias }}</a>
          <small class="text-muted">@{{ def.name }}</small>
        </div>
        <small v-if="options.showTip" class="d-block text-muted">{{ def.description }}</small>
      </div>
    </div>
  </div>

  <div class="btn-group mt-3 w-100">
    <button class='btn btn-secondary form-control' @click="update">Update</button>
<!--    <button class='btn btn-outline-secondary form-control' @click="test">test</button>-->
  </div>
</template>
