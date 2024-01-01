<script lang="ts" setup>
import {store, options} from './store'
import {computed} from "vue";

const restart = computed({
  get() {return store.value.restartForMark > 0},
  set(val) {store.value.restartForMark = val ? 1 : 0}
})

</script>

<template>
  <div class="form-check form-switch">
    <input class="form-check-input" type='checkbox' id='showTips' v-model='options.showTip'>
    <label for="showTips">Show tips</label>
  </div>
  <div class="form-check form-switch">
    <input class="form-check-input" type='checkbox' id='restartForMark' v-model='restart'>
    <label for="restartForMark">Restart number</label>
  </div>
<!--  <div class="form-floating mt-3">-->
<!--    <input type="text" class="form-control" id="fn" placeholder="1" v-model.number.lazy="store.fieldNumberForMark"/>-->
<!--    <label for="fn">Field number</label>-->
<!--  </div>-->
</template>


