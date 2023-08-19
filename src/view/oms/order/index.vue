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
            <el-table-column label="总金额" align="center" prop="memberUserName" show-overflow-tooltip></el-table-column>
            <el-table-column label="因付金额" align="center" prop="payAmount" show-overflow-tooltip></el-table-column>
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
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row }">
                    <el-button type="primary" size="small" icon="Edit" @click="look(row)">
                        查看订单
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
        <el-steps :active="2" align-center finish-status="success">
            <el-step title="提交订单" description="Some description" />
            <el-step title="支付订单" description="Some description" />
            <el-step title="平台发货" description="Some description" />
            <el-step title="确认收货" description="Some description" />
            <el-step title="完成评价" description="Some description" />
        </el-steps>
        <h2>订单详情</h2>
        <el-table :data="[orderInfo]">
            <el-table-column label="订单号" align="center" prop="orderSn" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名" align="center" prop="memberUserName" show-overflow-tooltip></el-table-column>
            <el-table-column label="总金额" align="center" prop="memberUserName" show-overflow-tooltip></el-table-column>
            <el-table-column label="因付金额" align="center" prop="payAmount" show-overflow-tooltip></el-table-column>
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
            <el-table-column label="备注" align="center" prop="note" show-overflow-tooltip></el-table-column>
            <el-table-column label="支付时间" align="center" prop="paymentTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="发货时间" align="center" prop="deliveryTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="确认收货时间" align="center" prop="receiveTime" show-overflow-tooltip></el-table-column>
            <el-table-column label="评论时间" align="center" prop="commentTime" show-overflow-tooltip></el-table-column>
        </el-table>
        <h2>收货人信息</h2>
        <el-table :data="[orderInfo]">
            <el-table-column label="收货人" align="center" prop="receiverName" show-overflow-tooltip></el-table-column>
            <el-table-column label="联系电话" align="center" prop="receiverPhone" show-overflow-tooltip></el-table-column>
            <el-table-column label="地址" align="center" show-overflow-tooltip>
                <template #="{ row }">
                    <span>{{ row.receiverProvince + row.receiverCity + row.receiverRegion + row.receiverDetailAddress
                    }}</span>
                </template>
            </el-table-column>
        </el-table>
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
            <el-table-column label="价格" align="center" prop="price" show-overflow-tooltip></el-table-column>
        </el-table>
        <!--  -->
        <h2>自提点</h2>
        <el-table :data="[placeInfo]">
            <el-table-column label="自提点图片" align="center" prop="pic" show-overflow-tooltip width="120px">
                <template #="{ row }">
                    <img :src="row.pic" alt="自提点图片" style="width: 100px; height: auto;" />
                </template>
            </el-table-column>
            <el-table-column label="名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="详细地址" align="center" prop="place" show-overflow-tooltip></el-table-column>
            <el-table-column label="联系电话" align="center" prop="phone" show-overflow-tooltip></el-table-column>
        </el-table>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reqOrderAll, reqOrderInfo } from '@/api/oms/order'
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
</script>

<style scoped>
h2 {
    font-size: 20px;
    margin: 20px 0 40px 0;
}
</style>