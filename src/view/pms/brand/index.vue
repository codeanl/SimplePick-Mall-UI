<template>
    <el-card class="box-card">
        <!-- 添加按钮 -->
        <el-button type="primary" size="default" icon="Plus" @click="addBrand" v-has="`btn.Trademark.add`">
            添加品牌
        </el-button>
        <!-- 表格组件展示数据 -->
        <el-table :data="brandList" border style="width: 100%;margin:10px 0px">
            <el-table-column type="selection" width="30" />
            <el-table-column prop="id" label="编号" width="180" />
            <el-table-column prop="tmName" label="品牌名称" width="180" />
            <el-table-column prop="address" label="Logo">
                <template #="{ row, $index }"><img :src="row.logoUrl" alt="图片未展示"
                        style="width:70px;height:70px;"></template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" />
            <el-table-column prop="updateTime" label="更新时间" />
            <el-table-column prop="address" label="操作">
                <template #="{ row, $index }">
                    <el-button type="primary" size="small" icon="Edit" @click="$event => updateBrand(row)"></el-button>
                    <el-popconfirm :title="`确定要删除吗${row.tmName}?`" width="250px" icon="Delete"
                        @confirm="deleteBeand(row.id)">
                        <template #reference>
                            <el-button type="danger" size="small" icon="Delete"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <div class="demo-pagination-block">
            <el-pagination @current-change="getHasTrademark" @size-change="getHasTrademark" v-model:current-page="pageNow"
                v-model:page-size="limit" :page-sizes="[5, 7, 10, 15]" :small="false" :background="true"
                layout=" prev, pager, next, jumper,total, sizes" :total="total" />
        </div>
    </el-card>

    <!-- 对话框  -->
    <el-dialog v-model="dialogFormVisible" :title="addBrandParams.id ? '修改品牌' : '添加品牌'">
        <el-form style="width:80%;
           align-items: center;" :model="addBrandParams" :rules="rules" ref="formRef">
            <el-form-item label="品牌名称" label-width="100px" prop="tmName">
                <el-input placeholder="请输入品牌名称" v-model="addBrandParams.tmName"></el-input>
            </el-form-item>
            <!--  -->
            <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
                <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="addBrandParams.logoUrl" :src="addBrandParams.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <!-- 插槽 -->
        <template #footer>
            <el-button>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
                <el-button type="primary" size="default" @click="confirm">确定</el-button>
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import type {
    Records,
    TradeMark,
    TradeMarkResponseData,
} from '@/api/pms/trademark/type'
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqHasTradeMark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/pms/trademark'
// 当前页面
let pageNow = ref<number>(1)
//每页个数
let limit = ref<number>(5)
//存储品牌的数据总数
let total = ref<number>(0)
//
let brandList = ref<Records>([])
//获取el-form组件实例
let formRef = ref()
//获取品牌列表接口
const getHasTrademark = async (pager = 1) => {
    pageNow.value = pager
    let result: TradeMarkResponseData = await reqHasTradeMark(pageNow.value, limit.value)
    if (result.code == 200) {
        total.value = result.data.total
        brandList.value = result.data.records
    }
    console.log(total);

}
onMounted(() => {
    getHasTrademark()
})

//控制对话框显示隐藏
let dialogFormVisible = ref<boolean>(false)

//添加品牌
const addBrand = () => {
    dialogFormVisible.value = true
    //清空校验提示的信息
    nextTick(() => {
        formRef.value.clearValidate('tmName')
        formRef.value.clearValidate('logoUrl')
    })
    //清空收集的数据
    addBrandParams.id = 0
    addBrandParams.tmName = ''
    addBrandParams.logoUrl = ''
}
//更新品牌
const updateBrand = (row: TradeMark) => {
    dialogFormVisible.value = true
    // addBrandParams.id=row.id
    // //收集已有数据
    // addBrandParams.tmName=row.tmName
    //  addBrandParams.logoUrl=row.logoUrl
    // es6语法合并对象
    Object.assign(addBrandParams, row)
    nextTick(() => {
        formRef.value.clearValidate('tmName')
        formRef.value.clearValidate('logoUrl')
    })
}

//对话框取消按钮
const cancel = () => {
    dialogFormVisible.value = false
}
//对话框确定按钮
const confirm = async () => {
    //整个表单校验
    await formRef.value.validate()
    let res = await reqAddOrUpdateTrademark(addBrandParams)
    if (res.code === 200) {
        dialogFormVisible.value = false
        ElMessage({
            type: 'success',
            message: addBrandParams.id ? '修改品牌成功' : '添加品牌成功',
        })
        getHasTrademark(addBrandParams.id ? pageNow.value : 1) //更新成功留在当前 添加成功跳转第一页
    } else {
        ElMessage({
            type: 'error',
            message: addBrandParams.id ? '修改品牌失败' : '添加品牌失败',
        })
    }
}

//定义新增品牌数据
let addBrandParams = reactive<TradeMark>({
    tmName: '',
    logoUrl: '',
})

//上传图片之前出发的钩子函数
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'
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
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    //上传返回的数据 图片url  uploadFile
    addBrandParams.logoUrl = response.data;
    formRef.value.clearValidate('logoUrl')
}

const validatorTmName = (rule: any, value: any, callBack: any) => {
    if (value.trim().length >= 2) {
        callBack()
    } else {
        callBack(new Error('品牌名称位数大于等于两位'))
    }
}

const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
    if (value) {
        callBack()
    } else {
        callBack(new Error('Logo的图片务必上传'))
    }
}
//表单校验
const rules = {
    //required 必填 trigger触发规则 blur change
    tmName: [
        {
            required: true,
            trigger: 'blur',
            validator: validatorTmName,
        },
    ],
    logoUrl: [
        {
            required: true,
            trigger: 'change',
            validator: validatorLogoUrl,
        },
    ],
}
//删除
const deleteBeand = async (id: number) => {
    let result = await reqDeleteTrademark(id)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除品牌成功',
        })
        //再次获取已有的品牌数据
        getHasTrademark(
            brandList.value.length > 1 ? pageNow.value : pageNow.value - 1,
        )
    } else {
        ElMessage({
            type: 'error',
            message: '删除品牌失败',
        })
    }
}

</script>

<style scoped lang="scss"></style>
<style>
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