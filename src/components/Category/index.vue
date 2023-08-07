<template>
    <div>
        <el-card>
            <el-form :inline="true">
                <el-form-item label="一级分类">
                    <el-select v-model="categoryStore.c1ID" @change="handler" :disabled="scene == 0 ? false : true">
                        <el-option v-for="(c1, index) in categoryStore.c1Arr" :key=c1.id :label="c1.name"
                            :value="c1.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类">
                    <el-select v-model="categoryStore.c2ID" @change="handler2" :disabled="scene == 0 ? false : true">
                        <el-option v-for="(c2, index) in categoryStore.c2Arr" :key=c2.id :label="c2.name"
                            :value="c2.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="三级分类">
                    <el-select v-model="categoryStore.c3ID" :disabled="scene == 0 ? false : true">
                        <el-option v-for="(c3, index) in categoryStore.c3Arr" :key=c3.id :label="c3.name"
                            :value="c3.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/pms/category'
let categoryStore = useCategoryStore()
onMounted(() => {
    categoryStore.getC1()
})

//选中一级有了id之后触发
const handler = () => {
    //清除原有的数据
    categoryStore.c2ID = ''
    categoryStore.c3Arr = []
    categoryStore.c3ID = ''
    categoryStore.c3Arr = []

    categoryStore.getC2()
}
const handler2 = () => {
    categoryStore.c3ID = ''
    categoryStore.c3Arr = []
    categoryStore.getC3()
}

//接收父组件传过来的scene
defineProps(['scene'])
</script>

<style scoped></style>