<template>
  <div>
    <!--  -->
    <Category :scene="scene"></Category>
    <!--  -->
    <el-card style="margin:10px 0">
      <!-- 展示数据列表 -->
      <div v-show="scene == 0">
        <el-button type="primary" size="default" icon="Plus" @click="addAttr"
          :disabled="categoryStore.c3ID ? false : true">添加属性</el-button>
        <el-table border style="margin:10px 0" :data="attrArr">
          <el-table-column label="编号" width="70px" align="center" prop="id"></el-table-column>
          <el-table-column label="属性名称" align="center" prop="attrName"></el-table-column>
          <el-table-column label="属性值" align="center">
            <template #="{ row, $index }">
              <el-tag type="success" style="margin: 5px" v-for="(item, index) in row.attrValueList" :key="item.id">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" @click="updateAttr(row)" icon="Edit">编辑</el-button>
              <el-popconfirm :title="`你确定删除${row.attrName}?`" width="200px" @confirm="deleteAttr(row.id)">
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- -------------------------------------------------------------------->
      <div v-show="scene == 1">
        <!-- 展示修改数据的结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button :disabled="attrParams.attrName ? false : true" type="primary" size="default" icon="Plus"
          @click="addAttrValue">添加属性值</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
        <el-table border style="margin:10px 0" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <!-- row当前的属性值对象 -->
              <el-input :ref="(vc: any) => inputArr[$index] = vc" v-if="row.flag" placeholder="请你输入属性值名称"
                v-model="row.valueName" @blur="toLook(row, $index)"></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <el-button type="danger" size="small" icon="Delete"
              @click="attrParams.attrValueList.splice($index, 1)"></el-button>
          </el-table-column>
        </el-table>
        <el-button type="primary" size="default" @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true">保存</el-button>
        <el-button type="primary" size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { AttrResponseData, Attr, AttrValue } from '@/api/pms/attr/type'
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/pms/category'
let categoryStore = useCategoryStore()

//获取属性
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/pms/attr'
//c存储已有的属性和属性值
let attrArr = ref<Attr[]>([])

watch(
  () => categoryStore.c3ID,
  () => {
    attrArr.value = []
    if (!categoryStore.c3ID) return
    getAttr()
  },
)
const getAttr = async () => {
  const { c1ID, c2ID, c3ID } = categoryStore
  let res: AttrResponseData = await reqAttr(c1ID, c2ID, c3ID)
  console.log(res.data);

  if (res.code === 200) {
    attrArr.value = res.data
  }
}
//定义卡片组件内容切换
let scene = ref<number>(0) // scene=0 => table
//添加
let addAttr = () => {
  //清除数据 
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })

  scene.value = 1
  //点击按钮的时候收集新增属性的三级分类的id
  attrParams.categoryId = categoryStore.c3ID
}
//修改
let updateAttr = (row: Attr) => {
  scene.value = 1
  //将已有的属性对象给
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
//取消按钮
let cancel = () => {
  scene.value = 0
}

//收集新增的数据
let attrParams = reactive<Attr>({
  attrName: '',//新增的名字
  attrValueList: [],//属性数组
  categoryId: '',//三级分类的id
  categoryLevel: 3,
})

//添加属性值
let addAttrValue = () => {
  //像数组添加属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true
  })
  //焦点
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

//保存按钮
const save = async () => {
  let res: any = await reqAddOrUpdateAttr(attrParams)
  if (res.code === 200) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}

//失去 焦点 查看模式  就是把input变成div
let toLook = (row: AttrValue, $index: number) => {
  //属性 。为空
  if (row.valueName.trim() === '') {
    // 清除掉
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //属性相同 
  let repeat = attrParams.attrValueList.find((item) => {
    if (item !== row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    //将重复的清除
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  //   
  row.flag = false
}

const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

//准备一个数组：将来存储对于的组件实例
let inputArr = ref<any>([])

//删除属性
let deleteAttr = async (id: number) => {
  let result = await reqRemoveAttr(id)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
//路由组件销毁的时候 把仓库的数据清空
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style scoped></style>