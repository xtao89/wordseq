<script lang="ts" setup>
import { PropType, computed, onMounted, onUnmounted, ref } from 'vue'
import { Person, Status } from '../essentials';

const props = defineProps({
  person: { type: Object as PropType<Person>, required: true },
  status: { type: Object as PropType<Status>, required: true }
})
const emits = defineEmits<{
  //a bug in Vue3, unable to retrieve the return value, so alternatively recieve the return value in the argument
  onSalary: [name: string, increasement: number, result: { ok: boolean }],
}>()

const fullname = computed(() => `${props.person.firstName} ${props.person.familyName}`)
const onSalaryRequest = () => {
  let result = { ok: false }
  emits('onSalary', fullname.value, 10, result);
  console.log(result)
}

onMounted(() => { })
onUnmounted(() => { })

</script>

<template>
  <div style="font-size:large;">{{ fullname }}
    <span style="font-size:small;">
      {{ person.male ? 'Male' : 'Female' }} | {{ person.age }}
    </span>
  </div>
  <div>
    salary:<span>{{ person.salary }}</span><button @click="onSalaryRequest">increase salary</button><br />
    <input type="checkbox" v-model="status.isSelected" />approve<br />

  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
