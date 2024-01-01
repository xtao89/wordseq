<script lang="ts" setup>
import SeqDefComp from './SeqDefComp.vue'
import SeqOperComp from './SeqOperComp.vue'
import SeqOption from './SeqOptionComp.vue'
import MessageComp from "./MessageBannerComp.vue";
import SeqOptionComp from "./SeqOptionComp.vue";

</script>

<template>
  <div class="container-sm">
    <div id="accordion">
      <div class="card">
        <div class="card-header">
          <i class="ms-Icon ms-font-xl ms-Icon--D365ProjectOperations ms-fontColor-themePrimary"></i>
          <a class="btn" data-bs-toggle="collapse" href="#collapse1"><strong>Sequence Operation</strong></a>
        </div>
        <div id="collapse1" class="collapse show" data-bs-parent="#accordion">
          <div class="card-body">
            <seq-oper-comp></seq-oper-comp>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <i class="ms-Icon ms-font-xl ms-Icon--BuildDefinition ms-fontColor-themePrimary"></i>
          <a class="collapsed btn" data-bs-toggle="collapse" href="#collapse2"><strong>Sequence Definition</strong></a>
        </div>
        <div id="collapse2" class="collapse" data-bs-parent="#accordion">
          <div class="card-body">
            <seq-def-comp></seq-def-comp>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <i class="ms-Icon ms-font-xl ms-Icon--ColumnOptions ms-fontColor-themePrimary"></i>
          <a class="collapsed btn" data-bs-toggle="collapse" href="#collapse3"><strong>Options</strong></a>
        </div>
        <div id="collapse3" class="collapse" data-bs-parent="#accordion">
          <div class="card-body">
            <seq-option-comp></seq-option-comp>
          </div>
        </div>
      </div>
    </div>
  </div>
  <message-comp></message-comp>
</template>
