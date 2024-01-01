<script lang="ts" setup>
import {store} from './store'

function messageClearDelayed() {
  setTimeout(() => {store.value.bannerMessage = '';}, 2000);
  return store.value.bannerMessage;
}
</script>

<template>
  <div v-if="store.bannerMessage">
    <div id="banner" class="alert alert-warning">{{ messageClearDelayed() }}</div>
  </div>
</template>

<style scoped>
#banner {
  position: fixed;
  bottom: 0;
  width: 100%;
  animation: fadein 1s;
}

@keyframes fadein
{
  from {opacity: 0.0;}
  to {opacity: 1.0;}
}

</style>