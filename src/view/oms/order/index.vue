<template>
    <!--  上边搜索 -->
    <!-- todo -->
    <el-card style="height: 80px">
        <el-form :inline="true" class="form">
            <el-form-item label="订单号:">
                <el-input placeholder="请输入搜索的用户名" v-model="orderSn"></el-input>
            </el-form-item>
            <el-form-item label="用户名:">
                <el-input placeholder="请输入搜索的用户名" v-model="memberUsername"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="search"
                    :disabled="orderSn.length || memberUsername.length ? false : true">
                    搜索
                </el-button>
                <el-button size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <!--  -->
    <el-card style="margin: 10px 0">
        <el-table border :data="listArr">
            <el-table-column type="selection" align="center" width="30px"></el-table-column>
            <el-table-column label="id" align="center" prop="id" width="50px"></el-table-column>
            <el-table-column label="订单号" align="center" prop="orderSn" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名" align="center" prop="memberUserName" show-overflow-tooltip></el-table-column>

            <el-table-column label="支付方式" align="center" prop="payType" show-overflow-tooltip>
                <template #="{ row }">
                    <template v-if="row.payType === '1'">
                        <el-tag key="item.label" class="mx-1" type="danger" effect="light">
                            微信
                        </el-tag>
                    </template>
                    <template v-if="row.payType === '2'">
                        <el-tag key="item.label" class="mx-1" type="success" effect="light">
                            支付宝
                        </el-tag>
                    </template>
                </template>
            </el-table-column>

            <el-table-column label="订单类型" align="center" prop="orderType" show-overflow-tooltip>
                <template #="{ row }">
                    <template v-if="row.orderType === '1'">
                        <el-tag key="item.label" class="mx-1" type="danger" effect="light">
                            正常订单
                        </el-tag>
                    </template>
                    <template v-if="row.orderType === '2'">
                        <el-tag key="item.label" class="mx-1" type="success" effect="light">
                            秒杀订单
                        </el-tag>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="地址" align="center" show-overflow-tooltip>
                <template #="{ row }">
                    <span>{{ row.receiverProvince + row.receiverCity + row.receiverRegion + row.receiverDetailAddress
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户信息" align="center" show-overflow-tooltip>
                <template #="{ row }">
                    <span>{{ row.receiverName + row.receiverPhone
                    }}</span>
                </template>
            </el-table-column>
            <el-table-column label="总金额" align="center" prop="totalAmount" show-overflow-tooltip>
                <template #="{ row }">
                    <p style="color: red;">¥{{ row.totalAmount }}</p>
                </template>
            </el-table-column>
            <el-table-column label="因付金额" align="center" prop="payAmount" show-overflow-tooltip>
                <template #="{ row }">
                    <p style="color: red;">¥{{ row.payAmount }}</p>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center" prop="status" show-overflow-tooltip>
                <template #="{ row }">
                    <template v-if="row.status === '0'">
                        <el-tag key="item.label" class="mx-1" type="danger" effect="light">
                            待付款
                        </el-tag>
                    </template>
                    <template v-if="row.status === '1'">
                        <el-tag key="item.label" class="mx-1" type="success" effect="light">
                            待发货
                        </el-tag>
                    </template>
                    <template v-if="row.status === '2'">
                        <el-tag key="item.label" class="mx-1" type="success" effect="light">
                            已发货
                        </el-tag>
                    </template>
                    <template v-if="row.status === '3'">
                        <el-tag key="item.label" class="mx-1" type="success" effect="light">
                            已完成
                        </el-tag>
                    </template>
                    <template v-if="row.status === '4'">
                        <el-tag key="item.label" class="mx-1" type="success" effect="light">
                            已关闭
                        </el-tag>
                    </template>
                    <template v-if="row.status === '5'">
                        <el-tag key="item.label" class="mx-1" type="success" effect="light">
                            无效订单
                        </el-tag>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row }">
                    <el-button type="primary" size="small" icon="Edit" @click="look(row)">
                        查看订单
                    </el-button>
                    <el-button v-if="row.status == '1'" type="success" size="small" icon="Edit" @click="addone(row)">
                        订单发货
                    </el-button>
                    <el-button v-if="row.status == '2'" type="info" size="small" icon="Edit" @click="addone(row)">
                        确认收货
                    </el-button>
                    <el-button v-if="row.status == '3'" type="danger" size="small" icon="Edit" @click="addone(row)">
                        删除订单
                    </el-button>
                    <el-button v-if="row.status == '4'" type="warning" size="small" icon="Edit" @click="addone(row)">
                        关闭订单
                    </el-button>
                    <el-button v-if="row.status == '5'" type="danger" size="small" icon="Edit">
                        删除订单
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            :background="true" layout="prev, pager, next, jumper, -> , sizes, total" :total="total" @current-change="getHas"
            @size-change="handler" />
    </el-card>

    <!-- 订单详情 -->
    <el-dialog v-model="drawer" title="订单详情" width="70%">
        <el-steps :active="orderInfo?.status" align-center finish-status="success">
            <!-- 0->待付款；1->待发货；2->已发货；3->确认收货；4->完成评价；5->无效订单 -->
            <el-step title="支付订单" description="Some description" />
            <el-step title="平台发货" description="Some description" />
            <el-step title="确认收货" description="Some description" />
            <el-step title="完成评价" description="Some description" />
            <el-step title="订单结束" description="Some description" />
        </el-steps>
        <!--  -->
        <!-- 商品 -->
        <h2>商品信息</h2>
        <el-table :data="skuList">
            <el-table-column label="商品图片" align="center" prop="pic" show-overflow-tooltip width="120px">
                <template #="{ row }">
                    <img :src="row.pic" alt="商品图片" style="width: 100px; height: auto;" />
                </template>
            </el-table-column>
            <el-table-column label="货号" align="center" prop="skuSn" show-overflow-tooltip></el-table-column>
            <el-table-column label="商品名称" align="center" prop="productName" show-overflow-tooltip></el-table-column>
            <el-table-column label="规格" align="center" prop="tag" show-overflow-tooltip width="300px"></el-table-column>
            <el-table-column label="价格" align="center" prop="price" show-overflow-tooltip>
                <template #="{ row }">
                    <p style="color: red;">¥{{ row.price }}</p>
                </template>
            </el-table-column>
        </el-table>
        <!--  -->
        <el-descriptions title="订单详情" direction="horizontal" :column="1" :size="size" border style="margin: 40px 0 0 20px;">
            <el-descriptions-item label="订单号">{{ orderInfo?.orderSn }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ orderInfo?.memberUserName }}</el-descriptions-item>
            <el-descriptions-item label="总金额">
                <p style="color: red;">¥{{ orderInfo?.totalAmount }}</p>
            </el-descriptions-item>
            <el-descriptions-item label="因付金额">
                <p style="color: red;">¥{{ orderInfo?.payAmount }}</p>
            </el-descriptions-item>
            <el-descriptions-item label="支付方式">
                <el-tag class="mx-1" effect="dark" v-if="orderInfo?.payType == '1'">
                    支付宝
                </el-tag>
                <el-tag class="mx-1" type="success" effect="dark" v-if="orderInfo?.payType == '2'">
                    微信
                </el-tag>

            </el-descriptions-item>
            <el-descriptions-item label="订单类型">
                <el-tag class="mx-1" effect="dark" v-if="orderInfo?.orderType == '1'">
                    正常订单
                </el-tag>
                <el-tag class="mx-1" type="success" effect="dark" v-if="orderInfo?.orderType == '2'">
                    秒杀订单
                </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="备注">{{ orderInfo?.note }}</el-descriptions-item>
            <el-descriptions-item label="发货时间">{{ orderInfo?.deliveryTime }}</el-descriptions-item>
            <el-descriptions-item label="确认收货时间">{{ orderInfo?.receiveTime }}</el-descriptions-item>
            <el-descriptions-item label="评论时间">{{ orderInfo?.commentTime }}</el-descriptions-item>
        </el-descriptions>
        <!--  -->
        <el-descriptions title="收货人信息" direction="horizontal" :column="1" :size="size" border
            style="margin: 40px 0 0 20px;">
            <el-descriptions-item label="收货人">{{ orderInfo?.receiverName }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ orderInfo?.receiverPhone }}</el-descriptions-item>
            <el-descriptions-item label="地址">{{ orderInfo?.receiverProvince
            }}{{ orderInfo?.receiverCity }}{{ orderInfo?.receiverRegion }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="自提点信息" direction="horizontal" :column="1" :size="size" border
            style="margin: 40px 0 0 20px;">
            <el-descriptions-item label="自提点图片">
                <img :src="placeInfo?.pic" alt="" style="width:200px">
            </el-descriptions-item>
            <el-descriptions-item label="名称">{{ placeInfo?.name }}</el-descriptions-item>
            <el-descriptions-item label="详细地址">{{ placeInfo?.place }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ placeInfo?.phone }}</el-descriptions-item>
        </el-descriptions>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqOrderAll, reqOrderInfo, reqAddOrUpdateOrder } from '@/api/oms/order'
//setting仓库
import useLayoutSettingStore from '@/store/setting'
let settingStore = useLayoutSettingStore()
const size = ref('')
//默认页码
let pageNo = ref<number>(1)
//默认个数
let pageSize = ref<number>(10)
let total = ref<number>(0)
//数据列表
let listArr = ref<any>([])
//订单详情
// 定义响应式数据
const orderInfo = ref<any>(null)
const skuList = ref<any[]>([])
const placeInfo = ref<any>(null)
//收集用户查找的关键字
let orderSn = ref<string>('')
let memberUsername = ref<string>('')
//定义响应式数据 抽屉的显示隐藏
//定义响应式数据 抽屉的显示隐藏
let drawer = ref<boolean>(false)
//组件挂载完毕
onMounted(() => {
    getHas()
})
//获取信息
const getHas = async (pager = 1) => {
    pageNo.value = pager
    let res: any = await reqOrderAll(
        pageNo.value,
        pageSize.value,
        orderSn.value,
        memberUsername.value,
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
//搜索按钮
const search = () => {
    getHas()
    orderSn.value = ''
    memberUsername.value = ''
}
//重置按钮
const reset = () => {
    settingStore.refresh = !settingStore.refresh
}

//查看订单详情
let look = async (row: any) => {
    drawer.value = true
    let res = await reqOrderInfo({ id: row.id })
    if (res.code === 200) {
        orderInfo.value = res.data.orderInfo
        skuList.value = res.data.skuList
        placeInfo.value = res.data.placeInfo
    }
}
let addone = async (row: any) => {
    let data: any = {
        id: row.id as number,
        status: String(parseInt(row.status) + 1)
    }
    let res = await reqAddOrUpdateOrder(data)
    if (res.code === 200) {
        ElMessage({ type: 'success', message: '修改成功' })
        window.location.reload()
    }
}
</script>

<style scoped>
h2 {
    font-size: 20px;
    margin: 20px 0 40px 0;
}
</style>