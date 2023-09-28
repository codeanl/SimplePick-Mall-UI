<template>
    <div class="container">
        <div class="left">
            <h2>专题列表</h2>
            <el-menu default-active="1">
                <el-menu-item v-for="(nowSubject, index) in subjectArr" :index="index" @click="getProduct(nowSubject)"
                    :key="nowSubject">
                    <span>{{ nowSubject.name }}</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class=" right" v-if="nowSubject">
            <el-card>
                <el-button type="success" size="default" @click="addProduct">
                    添加
                </el-button>
                <el-table border :data="productArr" @selection-change="selectChange" style="margin: 15px 0">
                    <el-table-column type="selection" align="center" width="40px"></el-table-column>
                    <!-- <el-table-column label="id" align="center" prop="id" width="50px"></el-table-column> -->
                    <el-table-column label="商品名称" align="center" prop="productInfo.name"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column label="商品图片" align="center" prop="productInfo.pic" show-overflow-tooltip>
                        <template #="{ row }">
                            <img :src="row.productInfo.pic" alt="商品图片" style="width: 80px; " />
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" align="center" prop="sort" show-overflow-tooltip></el-table-column>
                    <el-table-column label="是否显示" align="center" prop="status" show-overflow-tooltip>
                        <template #="{ row }">
                            <template v-if="row.status === '0'">
                                不显示
                            </template>
                            <template v-else-if="row.status === '1'">
                                显示
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300px" align="center">
                        <template #="{ row }">
                            <el-button type="danger" size="small" icon="Edit" @click="deleteSubjectProduct(row.id)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
                    :background="true" layout="prev, pager, next, jumper, -> , sizes, total" :total="total"
                    @current-change="getProductList()" @size-change="handler" />
            </el-card>
        </div>
    </div>

    <!--  -->
    <el-dialog v-model="drawer" title="添加">
        <el-table border :data="productList" @selection-change="selectChange" style="margin-bottom: 15px">
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
        <!-- 分页 -->
        <el-pagination v-model:current-page="pageNo1" v-model:page-size="pageSize1" :page-sizes="[5, 10, 15, 20]"
            :background="true" layout="prev, pager, next, jumper, -> , sizes, total" :total="total1"
            @current-change="getProductList1()" @size-change="handler1" />
        <template #footer>
            <div style="flex: auto">
                <el-button type="primary" @click="addHotRecommend">添加</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { reqsubjectList } from '@/api/sms/subject'
import { reqsubjectProductList, reqRemovesubjectProduct, reqUpdate, reqAdd } from '@/api/sms/subjectProduct'
import { reqAllProduct } from '@/api/pms/product'
//setting仓库
import useLayoutSettingStore from '@/store/setting'
let settingStore = useLayoutSettingStore()

//默认页码
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)

//收集删除的id
let ids = ref<number[]>([])
let productIds = ref<number[]>([])
//数据列表
let subjectArr = ref<any>([])
let productArr = ref<any>([])
let productList = ref<any>([])
//当前所在的专题id
let nowSubject = ref<number>(0)
//订单详情
// 定义响应式数据
const name = ref<any>(null)
const status = ref<any>(null)
//多选框选择的id
let selectIdArr = ref<any[]>([])
//定义响应式数据 抽屉的显示隐藏
//定义响应式数据 抽屉的显示隐藏
let drawer = ref<boolean>(false)
//复选框选择
const selectChange = (value: any) => {
    selectIdArr.value = value
}

//组件挂载完毕
onMounted(() => {
    getHas()
})
//获取信息
const getHas = async () => {
    let res: any = await reqsubjectList(
        pageNo.value,
        pageSize.value,
        name.value,
        status.value,
    )
    if (res.code == 200) {
        subjectArr.value = res.data
        //
        nowSubject.value = res.data[0].id
        getProductList()
    }
}

let getProduct = async (row: any) => {
    nowSubject.value = row.id
    getProductList()
}

let getProductList = async () => {
    let res = await reqsubjectProductList(
        pageNo.value,
        pageSize.value,
        nowSubject.value as number
    )
    if (res.code === 200) {
        productArr.value = res.data
        total.value = res.total
    }
}

//搜索按钮
const search = () => {
    getProductList()
    status.value = ''
}
//下拉改变
const handler = () => {
    getProductList()
}

let pageNo1 = ref<number>(1)
let pageSize1 = ref<number>(5)
let total1 = ref<number>(0)
let namedd = ref<any>()
let categoryId = ref<any>()
let getProductList1 = async () => {
    let res = await reqAllProduct(
        pageNo1.value,
        pageSize1.value,
        namedd.value,
        categoryId.value,
    )
    if (res.code === 200) {
        productList.value = res.data
        total1.value = res.total
    }
}
const handler1 = () => {
    getProductList1()
}
const deleteSubjectProduct = async (id: number) => {
    ids.value.push(id);
    const requestData: any = { ids: ids.value };
    let res: any = await reqRemovesubjectProduct(requestData);
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getProductList()
    }
}
const addProduct = async () => {
    drawer.value = true
    getProductList1()
}
const addHotRecommend = async () => {
    productIds.value = selectIdArr.value.map((item) => {
        return item.id
    })
    const requestData: any = {
        subject_id: nowSubject.value,
        product_id: productIds.value,
        status: "1",
        sort: 1,
    };
    let res: any = await reqAdd(requestData);
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        drawer.value = false
        getProductList()
    }
}


</script>

<style scoped lang="scss">
.container {
    display: flex;
}

.left {
    width: 15%;
    margin: 0 30px;

    h2 {
        font-size: 17px;
        margin-bottom: 10px;
    }
}

.right {
    width: 80%;
    height: 100%;
    float: right;
}
</style>