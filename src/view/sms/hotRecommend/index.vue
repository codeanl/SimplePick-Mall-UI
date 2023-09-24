<template>
    <!-- 上边搜索 -->
    <el-card style="height: 80px">
        <el-form :inline="true" class="form">
            <el-form-item label="状态:">
                <el-select v-model="status" class="m-2" placeholder="请选择状态">
                    <el-option label="正常" value="1" />
                    <el-option label="禁用" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="search" :disabled="status.length ? false : true">
                    搜索
                </el-button>
                <el-button size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <!--  -->
    <el-card style="margin: 10px 0">
        <el-button type="success" size="default" @click="add">
            添加
        </el-button>
        <el-button type="danger" size="default" @click="deleteSelect" :disabled="selectIdArr.length ? false : true">
            批量删除
        </el-button>
        <el-table border :data="listArr" @selection-change="selectChange">
            <el-table-column type="selection" align="center" width="30px"></el-table-column>
            <el-table-column label="id" align="center" prop="id" width="50px"></el-table-column>
            <el-table-column label="图片" align="center" prop="productInfo.pic" show-overflow-tooltip width="120px">
                <template #="{ row }">
                    <img :src="row.productInfo.pic" alt="图片" style="width: 100px; height: auto;" />
                </template>
            </el-table-column>
            <el-table-column label="名称" align="center" prop="productInfo.name" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" align="center" prop="status" show-overflow-tooltip>
                <template #="{ row }">
                    <template v-if="row.status === '0'">
                        <el-tag key="item.label" class="mx-1" type="danger" effect="light">
                            不显示
                        </el-tag>
                    </template>
                    <template v-if="row.status === '1'">
                        <el-tag key="item.label" class="mx-1" type="success" effect="light">
                            显示
                        </el-tag>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="排序" align="center" prop="sort" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row }">
                    <el-button type="primary" size="small" icon="Edit" @click="update(row)">
                        编辑
                    </el-button>
                    <el-popconfirm :title="`你确定删除${row.productInfo.name}`" width="260px" @confirm="deletePlace(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            :background="true" layout="prev, pager, next, jumper, -> , sizes, total" :total="total" @current-change="getHas"
            @size-change="handler" />
    </el-card>
    <!-- 抽屉  完成 添加｜修改 的窗口 -->
    <el-dialog v-model="drawer" title="更新">
        <el-form :model="Params" ref="formRef">
            <el-form-item label="排序" prop="sort">
                <el-input placeholder="请您输入排序" v-model="Params.sort"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="Params.status" class="m-2" placeholder="请选择性别">
                    <el-option label="不显示" value="0" />
                    <el-option label="显示" value="1" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="saveUpdate">确定</el-button>
            </div>
        </template>
    </el-dialog>
    <!--  -->
    <el-dialog v-model="drawer1" title="添加11">
        <el-table border :data="productList" @selection-change="selectChange">
            <el-table-column type="selection" align="center" width="30px"></el-table-column>
            <el-table-column label="id" align="center" prop="id" width="50px"></el-table-column>
            <el-table-column label="图片" align="center" prop="pic" show-overflow-tooltip width="120px">
                <template #="{ row }">
                    <img :src="row.pic" alt="图片" style="width: 100px; height: auto;" />
                </template>
            </el-table-column>
            <el-table-column label="名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="货号" align="center" prop="productSn" show-overflow-tooltip></el-table-column>
            <el-table-column label="销量" align="center" prop="sale" show-overflow-tooltip></el-table-column>
        </el-table>
        <template #footer>
            <div style="flex: auto">
                <el-button type="primary" @click="addHotRecommend">添加</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqhotRecommendList, reqhotRecommendDel, reqUpdate, reqAdd } from '@/api/sms/hotRecommend'
import { reqAllProduct } from '@/api/pms/product'
//setting仓库
import useLayoutSettingStore from '@/store/setting'
let settingStore = useLayoutSettingStore()
//默认页码
let pageNo = ref<number>(1)
//默认个数
let pageSize = ref<number>(10)
let total = ref<number>(0)
//数据列表
let listArr = ref<any>([])
let productList = ref<any>([])
//收集删除的id
let ids = ref<number[]>([])
//多选框选择的id
let selectIdArr = ref<any[]>([])
//收集用户查找的关键字
let status = ref<string>('')
//复选框选择
const selectChange = (value: any) => {
    selectIdArr.value = value
}

//组件实例
let formRef = ref<any>()
//定义响应式数据 抽屉的显示隐藏
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
let Params = reactive<any>({
    id: 0,
    status: '',
    sort: '',
})
let addParams = reactive<any>({
    productIds: []
})
//组件挂载完毕
onMounted(() => {
    getHas()
})
//获取信息
const getHas = async (pager = 1) => {
    pageNo.value = pager
    let res: any = await reqhotRecommendList(
        pageNo.value,
        pageSize.value,
        status.value,
    )
    if (res.code == 200) {
        total.value = res.total
        listArr.value = res.data
    }
}
//下拉改变
const handler = () => {
    getHas()
}
// 编辑按钮
const update = (row: any) => {
    drawer.value = true
    Object.assign(Params, row)
    nextTick(() => {
        formRef.value.clearValidate('sort')
        formRef.value.clearValidate('status')
    })
}
//取消按钮
const cancel = () => {
    drawer.value = false
}
//窗口保存按钮
const saveUpdate = async () => {
    Params.sort = parseInt(Params.sort)
    let res: any = await reqUpdate(Params)
    if (res.code == 200) {
        drawer.value = false
        ElMessage({
            type: 'success',
            message: '更新成功',
        })
        getHas()
    } else {
        drawer.value = false
        ElMessage({
            type: 'error',
            message: '更新失败',
        })
    }
}

//添加按钮
const add = async () => {
    drawer1.value = true
    //存储收集已有的账号信息
    let res = await reqAllProduct()
    if (res.code == 200) {
        productList.value = res.data
    }
}
const addHotRecommend = async () => {
    productIds.value = selectIdArr.value.map((item) => {
        return item.id
    })
    const requestData: any = { productIds: productIds.value };
    let res: any = await reqAdd(requestData);
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        drawer1.value = false
        getHas(listArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
// 删除按钮
const deletePlace = async (id: number) => {
    ids.value.push(id);
    const requestData: any = { ids: ids.value };
    let res: any = await reqhotRecommendDel(requestData);
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHas(listArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
//批量删除用户按钮
const deleteSelect = async () => {
    ids.value = selectIdArr.value.map((item) => {
        return item.id
    })
    const requestData: any = { ids: ids.value };
    let res: any = await reqhotRecommendDel(requestData);
    if (res.code === 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHas(listArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
//搜索按钮
const search = () => {
    getHas()
    status.value = ''
}
//重置按钮
const reset = () => {
    settingStore.refresh = !settingStore.refresh
}
</script>

<style scoped>
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>