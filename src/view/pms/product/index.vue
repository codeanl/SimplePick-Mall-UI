<template>
    <el-card style="margin: 10px 0">
        <el-button type="success" size="default" @click="add">
            添加用户
        </el-button>
        <el-button type="danger" size="default" @click="deleteSelect" :disabled="selectIdArr.length ? false : true">
            批量删除
        </el-button>
        <el-table border :data="listArr" @selection-change="selectChange">
            <el-table-column type="selection" align="center" width="30px"></el-table-column>
            <el-table-column label="id" align="center" prop="id" width="50px"></el-table-column>
            <el-table-column label="商品封面" align="center" prop="pic" show-overflow-tooltip width="120px">
                <template #="{ row }">
                    <img :src="row.pic" alt="商品封面" style="width: 100px; height: auto;" />
                </template>
            </el-table-column>
            <el-table-column label="商品名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="货号" align="center" prop="productSn" show-overflow-tooltip></el-table-column>
            <el-table-column label="副标题" align="center" prop="subTitle" show-overflow-tooltip></el-table-column>
            <el-table-column label="商品描述" align="center" prop="description" show-overflow-tooltip></el-table-column>
            <el-table-column label="价格" align="center" prop="price" show-overflow-tooltip></el-table-column>
            <el-table-column label="市场价" align="center" prop="originalPrice" show-overflow-tooltip></el-table-column>
            <el-table-column label="库存" align="center" prop="stock" show-overflow-tooltip></el-table-column>
            <el-table-column label="单位" align="center" prop="unit" show-overflow-tooltip></el-table-column>
            <el-table-column label="销量" align="center" prop="sale" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row }">
                    <el-button type="primary" size="small" icon="Edit" @click="update(row)">
                        编辑
                    </el-button>
                    <el-popconfirm :title="`你确定删除${row.name}`" width="260px" @confirm="deleteproduct(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                    <el-button type="primary" size="small" icon="Edit" @click="look(row.id)">
                        查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
            :background="true" layout="prev, pager, next, jumper, -> , sizes, total" :total="total" @current-change="getHas"
            @size-change="handler" />
    </el-card>
    <!-- 抽屉  完成 添加｜修改 的窗口 -->
    <el-dialog v-model="drawer" :title="Params.id ? '更新' : '添加'">
        <!-- <el-steps :active="currentStep" align-center>
            <el-step title="添加用户信息" description="Some description"></el-step>
            <el-step title="添加角色信息" description="Some description"></el-step>
        </el-steps>
        <div v-if="currentStep === 0">
            <el-form>
                1111
            </el-form>
        </div>
        <div v-else-if="currentStep === 1">
            <el-form>
            </el-form>
        </div> -->
        <el-form :model="Params" ref="formRef" :inline="true">
            <el-form-item label="名称" prop="name">
                <el-input placeholder="请您输入名称" v-model="Params.name"></el-input>
            </el-form-item>
            <el-form-item label="所属分类">
                <el-tree-select v-model="Params.categoryId" :data="CateListArr" check-strictly
                    :props="{ key: 'categoryId', label: 'name' }" node-key="id" :render-after-expand="false"
                    @change="fetchAttributeList(Params.categoryId)" />
            </el-form-item>
            <el-form-item label="货号" prop="productSn">
                <el-input placeholder="请您输入货号" v-model="Params.productSn"></el-input>
            </el-form-item>
            <el-form-item label="副标题" prop="subTitle">
                <el-input placeholder="请您输入副标题" v-model="Params.subTitle"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="description">
                <el-input placeholder="商品描述" v-model="Params.description"></el-input>
            </el-form-item>
            <el-form-item label="市场价" prop="originalPrice">
                <el-input placeholder="市场价" v-model="Params.originalPrice"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
                <el-input placeholder="单位" v-model="Params.unit"></el-input>
            </el-form-item>
            <el-form-item label="商品封面" prop="pic">
                <el-upload class="avatar-uploader" action="/api/api/sys/upload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="Params.pic" :src="Params.pic" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
            <!-- <el-form-item label="属性列表" prop="attrList">
                <el-select v-model="Params.attrList" placeholder="请选择属性">
                    <el-option v-for="attr in AttrArr" :key="attr.id" :label="attr.name" :value="attr.value" />
                </el-select>
            </el-form-item> -->
        </el-form>
        <el-form :model="Params" :inline="true">
            <el-form-item v-for="(attr, index) in AttrArr" :label="attr.name" :prop="`attrList${index}`">
                <el-select v-model="Params.attributeValueID[index]" placeholder="请选择属性">
                    <el-option v-for="option in attr.attributeValue" :key="option.id" :label="option.name"
                        :value="option.id" />
                </el-select>
            </el-form-item>
        </el-form>
        <el-form :model="Params" :inline="true">
            <el-input v-model="newAttributeName" placeholder="请输入属性名字"></el-input>
            <el-button style="margin-left: 10px" type="primary" size="default" icon="Plus" @click="addAttribute">
                添加属性
            </el-button>
            <el-table border style="margin: 10px 0" :data="Params.sizeList">
                <el-table-column label="销售属性名字" width="120px" prop="name"></el-table-column>
                <el-table-column label="销售属性值">
                    <template #="{ row, $index }">
                        <el-tag v-for="(item) in row.sizeValueList" :key="row.id" class="mx-1" closable
                            style="margin: 0 8px" @close="row.sizeValueList.splice($index, 1)">
                            {{ item.name }}
                        </el-tag>
                        <el-input v-model="newTagValue" placeholder="请输入属性值" size="small" style="width: 50px"></el-input>
                        <el-button size=" small" icon="Plus" @click="addTagValue(row)"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{ row, $index }">
                        <el-button type="danger" size="small" icon="Delete"
                            @click="Params.sizeList.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-dialog>
    <!-- sku -->
    <el-dialog v-model="drawer1" title="SKU列表" width="70%">
        <el-button type="success" size="default" @click="addSku">
            添加用户
        </el-button>
        <el-table :data="skuArr"><el-table-column label="SKU图片">
                <template #="{ row }">
                    <img :src="row.pic" alt="" style="width: 100px; height: 100px" />
                </template>
            </el-table-column>
            <el-table-column label="sku编号" prop="skuSn"></el-table-column>
            <el-table-column label="SKU名字" prop="name"></el-table-column>
            <el-table-column label="SKU价格" prop="price"></el-table-column>
            <el-table-column label="库存" prop="stock"></el-table-column>
            <el-table-column label="TAG" prop="tag"></el-table-column>
            <el-table-column label="描述" prop="description"></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row }">
                    <el-button type="primary" size="small" icon="Edit" @click="updatesku(row)">
                        编辑
                    </el-button>
                    <el-popconfirm :title="`你确定删除${row.name}`" width="260px" @confirm="deleteSku(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete">
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
    <!--  -->
    <el-dialog v-model="drawer2" title="SKU列表" width="70%">
        <el-form :model="SkuParams" ref="formRef">
            <el-form-item label="名称" prop="name">
                <el-input placeholder="请您输入名称" v-model="SkuParams.name"></el-input>
            </el-form-item>
            <el-form-item label="sku编号" prop="SkuSn">
                <el-input placeholder="请您输入副标题" v-model="SkuParams.SkuSn"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="description">
                <el-input placeholder="商品描述" v-model="SkuParams.description"></el-input>
            </el-form-item>
            <el-form-item label="副标题" prop="subTitle">
                <el-input placeholder="副标题" v-model="SkuParams.subTitle"></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="stock">
                <el-input placeholder="库存" v-model="SkuParams.stock"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="stock">
                <el-input placeholder="价格" v-model="SkuParams.price"></el-input>
            </el-form-item>
            <el-form-item label="商品封面" prop="pic">
                <el-upload class="avatar-uploader" action="/api/api/sys/upload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="SkuParams.pic" :src="SkuParams.pic" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelsku">取消</el-button>
                <el-button type="primary" @click="savesku">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
// let currentStep = ref<number>(1)
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqAllProduct, reqAddOrUpdate, reqRemove, reqSku, reqRemoveSKU } from '@/api/pms/product'
import { reqAll } from '@/api/pms/category'
import { reqAllAttribute } from '@/api/pms/attribute'
//默认页码
let pageNo = ref<number>(1)
//默认个数
let pageSize = ref<number>(10)
let total = ref<number>(0)
//数据列表
let listArr = ref<any>([])
let skuArr = ref<any>([])
let AttrArr = ref<any>([])
let AttrValueIDs = ref<any>([])
//收集删除的id
let ids = ref<number[]>([])
//多选框选择的id
let selectIdArr = ref<any[]>([])
//复选框选择
const selectChange = (value: any) => {
    selectIdArr.value = value
}
//下拉改变
const handler = () => {
    getHas()
}
//分类
let CateListArr = ref<any>([]);
//组件实例
let formRef = ref<any>()
//定义响应式数据 抽屉的显示隐藏
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
let drawer2 = ref<boolean>(false)
let Params = reactive<any>({
    categoryId: 0,
    name: '',
    pic: '',
    description: '',
    price: '',
    originalPrice: 0,
    unit: '',
    productSn: '',
    subTitle: '',
    attributeValueID: [],
    size: [],
    sizeList: []
})
let SkuParams = reactive<any>({
    productId: 0,
    name: '',
    pic: '',
    SkuSn: '',
    subTitle: '',
    description: '',
    stock: '',
    price: '',
    AttributeValueID: '',
    AttributeShopValueID: ''
})
//组件挂载完毕
onMounted(() => {
    getHas()
})
//获取信息
const getHas = async (pager = 1) => {
    pageNo.value = pager
    let res: any = await reqAllProduct(
        pageNo.value,
        pageSize.value,
    )
    if (res.code == 200) {
        total.value = res.total
        listArr.value = res.data
    }
    let res1: any = await reqAll()
    if (res1.code === 200) {
        CateListArr.value = res1.data
    }
}

//取消按钮
const cancel = () => {
    drawer.value = false
}
// 编辑按钮
const update = (row: any) => {
    drawer.value = true
    Params.attributeValueID = []
    fetchAttributeList(row.categoryId)
    AttrValueIDs.value = row.attrValueIds
    Object.assign(Params, row)
}
//添加用户按钮
const add = () => {
    drawer.value = true
    //存储收集已有的账号信息
    Object.assign(Params, {
        id: 0,
        categoryId: 0,
        name: '',
        pic: '',
        description: '',
        price: '',
        originalPrice: 0,
        unit: '',
        productSn: '',
        subTitle: '',
        sizeList: []
    })
}

//窗口保存按钮
const save = async () => {
    // 将 originalPrice 字段转换为 float64 类型
    Params.originalPrice = parseFloat(Params.originalPrice);
    Params.price = parseFloat(Params.price);
    Params.size = Params.sizeList.map(item => {
        return { name: item.name, sizeValue: item.sizeValueList };
    });
    let res: any = await reqAddOrUpdate(Params)
    if (res.code == 200) {
        drawer.value = false
        ElMessage({
            type: 'success',
            message: Params.id ? '更新成功' : '添加成功',
        })
        // window.location.reload()
        getHas()
    } else {
        drawer.value = false
        ElMessage({
            type: 'error',
            message: Params.id ? '更新失败' : '添加失败',
        })
    }
}

//批量删除用户按钮
const deleteSelect = async () => {
    ids.value = selectIdArr.value.map((item) => {
        return item.id
    })
    const requestData: any = { ids: ids.value };
    let res: any = await reqRemove(requestData);
    if (res.code === 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHas(listArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
// 删除按钮
const deleteproduct = async (id: number) => {
    ids.value.push(id);
    const requestData: any = { ids: ids.value };
    let res: any = await reqRemove(requestData);
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHas(listArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
import type { UploadProps } from 'element-plus'
import { size } from 'lodash';
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    //上传返回的数据 图片url  uploadFile
    Params.pic = response.data;
    formRef.value.clearValidate('pic')
}
//上传图片之前出发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (
        rawFile.type === 'image/png' ||
        rawFile.type === 'image/jpeg' ||
        rawFile.type === 'image/gif'
    ) {
        if (rawFile.size / 1024 / 1024 < 4) {
            return true
        } else {
            ElMessage({
                type: 'error',
                message: '上传的文件大小应小于4M',
            })
        }
    } else {
        ElMessage({
            type: 'error',
            message: '上传的文件类型必须是PNG|JPG|GIF',
        })
        return false
    }
}

let look = async (id: number) => {
    drawer1.value = true
    let res: any = await reqSku({ productID: id })
    if (res.code == 200) {
        skuArr.value = res.data
    }
}
// 删除sku按钮
const deleteSku = async (id: number) => {
    ids.value = []
    ids.value.push(id);
    const requestData: any = { ids: ids.value };
    let res: any = await reqRemoveSKU(requestData);
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        drawer1.value = false
    }
}
// 添加sku按钮
const addSku = () => {
    drawer2.value = true
}
// 更新sku按钮
const updatesku = () => {
    drawer2.value = true
    drawer1.value = false
}
//sku取消按钮
const cancelsku = () => {
    drawer2.value = false
    drawer1.value = true
}
//sku确定按钮
const savesku = () => {
    drawer2.value = false
    drawer1.value = true
}

// let handleNodeClick = async (event: any, id: number) => {
//     let res = await reqAllAttribute(1, 100, '', '', id)
//     if (res.code == 200) {
//         AttrArr.value = res.data
//     }
// }
let fetchAttributeList = async (categoryId: number) => {
    let res = await reqAllAttribute(1, 100, '', '', categoryId)
    if (res.code == 200) {
        AttrArr.value = res.data
    }
}
// -------------------------------
let newTagValue = ref<any>([])
let newAttributeName = ref<any>([])
let addAttribute = () => {
    if (newAttributeName.value) {
        Params.sizeList.push({
            name: newAttributeName.value,
            sizeValueList: []
        });
        newAttributeName.value = ''; // 清空输入框
    }
}

let addTagValue = (row: any) => {
    if (newTagValue.value) {
        row.sizeValueList.push({
            name: newTagValue.value
        });
        newTagValue.value = ''; // 清空输入框
    }
}
</script>

<style lang="scss" scoped></style>
<style>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>