<!-- 部门树 -->
<template>
  <el-card shadow="never">
    <el-input v-model="pkgName" placeholder="包裹名称" clearable>
      <template #prefix>
        <i-ep-search />
      </template>
    </el-input>

    <el-tree
      ref="pkgTreeRef"
      class="mt-2"
      :data="pkgList"
      :props="{ children: 'children', label: 'label', disabled: '' }"
      :expand-on-click-node="false"
      :filter-node-method="handleFilter"
      default-expand-all
      @node-click="handleNodeClick"
    />
  </el-card>
</template>

<script setup lang="ts">
import { getPkgOptions } from "@/api/system/user-package";

const props = defineProps({
  modelValue: {
    type: [Number],
    default: undefined,
  },
});

const pkgList = ref<OptionType[]>(); // 包裹列表
const pkgTreeRef = ref(ElTree); // 部门树
const pkgName = ref(); // 包裹名称

const emits = defineEmits(["node-click"]);

const pkgId = useVModel(props, "modelValue", emits);

watchEffect(
  () => {
    pkgTreeRef.value.filter(pkgName.value);
  },
  {
    flush: "post", // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
  }
);

/** 部门筛选 */
function handleFilter(value: string, data: any) {
  if (!value) {
    return true;
  }
  return data.label.indexOf(value) !== -1;
}

/** 部门树节点 Click */
function handleNodeClick(data: { [key: string]: any }) {
  pkgId.value = data.value;
  emits("node-click");
}

onBeforeMount(() => {
  getPkgOptions().then((response) => {
    pkgList.value = response.data;
  });
});
</script>
