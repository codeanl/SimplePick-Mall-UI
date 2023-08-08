<template>
    <!-- 上边搜索 -->
    <el-card style="height: 80px">
        <el-form :inline="true" class="form">
            <el-form-item label="名称:">
                <el-input placeholder="请输入搜索的用户名" v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="地址:">
                <el-input placeholder="请输入搜索的用户名" v-model="place"></el-input>
            </el-form-item>
            <el-form-item label="手机号:">
                <el-input placeholder="请输入搜索的用户名" v-model="phone"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="search"
                    :disabled="name.length || place.length || phone.length ? false : true">
                    搜索
                </el-button>
                <el-button size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <!--  -->
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
            <el-table-column label="门店图片" align="center" prop="pic" show-overflow-tooltip width="120px">
                <template #="{ row }">
                    <img :src="row.pic" alt="头像" style="width: 100px; height: auto;" />
                </template>
            </el-table-column>
            <el-table-column label="名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="联系方式" align="center" prop="phone" show-overflow-tooltip></el-table-column>
            <el-table-column label="详细地址" align="center" prop="place" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" align="center" prop="status" show-overflow-tooltip>
                <template #="{ row }">
                    <template v-if="row.status === '0'">
                        <el-tag key="item.label" class="mx-1" type="danger" effect="light">
                            暂停营业
                        </el-tag>
                    </template>
                    <template v-if="row.status === '1'">
                        <el-tag key="item.label" class="mx-1" type="success" effect="light">
                            营业中
                        </el-tag>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="负责人" align="center" prop="principal" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row }">
                    <el-button type="primary" size="small" icon="Edit" @click="update(row)">
                        编辑
                    </el-button>
                    <el-popconfirm :title="`你确定删除${row.username}`" width="260px" @confirm="deletePlace(row.id)">
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
            :background="true" layout="prev, pager, next, jumper, -> , sizes, total" :total="total"
            @current-change="getHasPlace" @size-change="handler" />
    </el-card>
    <!--  -->
    <!-- 抽屉  完成 添加｜修改 的窗口 -->
    <el-dialog v-model="drawer" :title="Params.id ? '更新自提点' : '添加自提点'">
        <el-form :model="Params" ref="formRef">
            <el-form-item label="名称" prop="name">
                <el-input placeholder="请您输入名称" v-model="Params.name"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="place">
                <el-input placeholder="请您输入联系方式" v-model="Params.place"></el-input>
            </el-form-item>
            <el-form-item label="详细地址" prop="phone">
                <el-input placeholder="请您输入详细地址" v-model="Params.phone"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="Params.status" class="m-2" placeholder="请选择性别">
                    <el-option label="暂停营业" value="0" />
                    <el-option label="营业中" value="1" />
                </el-select>
                <!-- <el-input placeholder="请您输入状态" v-model="Params.status"></el-input> -->
            </el-form-item>
            <el-form-item label="负责人" prop="principal">
                <el-input placeholder="请您输入负责人" v-model="Params.principal"></el-input>
            </el-form-item>
            <el-form-item label="门店图片" prop="pic">
                <el-upload class="avatar-uploader" action="/api/api/sys/upload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="Params.pic" :src="Params.pic" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
                <!-- <el-input placeholder="请您输入门店图片" v-model="Params.pic"></el-input> -->
            </el-form-item>
        </el-form>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { reqPlaceList, reqRemovePlace, reqAddOrUpdate } from '@/api/sys/place'
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
//收集用户查找的关键字
let name = ref<string>('')
let place = ref<string>('')
let phone = ref<string>('')
//收集删除的id
let ids = ref<number[]>([])
//多选框选择的id
let selectIdArr = ref<any[]>([])
//复选框选择
const selectChange = (value: any) => {
    selectIdArr.value = value
}
//组件实例
let formRef = ref<any>()
//定义响应式数据 抽屉的显示隐藏
let drawer = ref<boolean>(false)
let Params = reactive<any>({
    name: '',
    place: '',
    status: '',
    pic: '',
    phone: '',
    principal: '',
})
//组件挂载完毕
onMounted(() => {
    getHasPlace()
})
//获取信息
const getHasPlace = async (pager = 1) => {
    pageNo.value = pager
    let res: any = await reqPlaceList(
        pageNo.value,
        pageSize.value,
        name.value,
        place.value,
        phone.value,
    )
    if (res.code == 200) {
        total.value = res.total
        listArr.value = res.data
    }
}
//下拉改变
const handler = () => {
    getHasPlace()
}
//搜索按钮
const search = () => {
    getHasPlace()
    name.value = ''
    place.value = ''
    phone.value = ''
}
// 删除按钮
const deletePlace = async (id: number) => {
    ids.value.push(id);
    const requestData: any = { ids: ids.value };
    let res: any = await reqRemovePlace(requestData);
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHasPlace(listArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
//批量删除用户按钮
const deleteSelect = async () => {
    ids.value = selectIdArr.value.map((item) => {
        return item.id
    })
    const requestData: any = { ids: ids.value };
    let res: any = await reqRemovePlace(requestData);
    if (res.code === 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHasPlace(listArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
//重置按钮
const reset = () => {
    settingStore.refresh = !settingStore.refresh
}
//取消按钮
const cancel = () => {
    drawer.value = false
}
// 编辑按钮
const update = (row: any) => {
    drawer.value = true
    Object.assign(Params, row)
    nextTick(() => {
        formRef.value.clearValidate('name')
        formRef.value.clearValidate('place')
        formRef.value.clearValidate('status')
        formRef.value.clearValidate('pic')
        formRef.value.clearValidate('phone')
        formRef.value.clearValidate('principal')
    })
}
//添加用户按钮
const add = () => {
    drawer.value = true
    //存储收集已有的账号信息
    Object.assign(Params, {
        id: 0,
        name: '',
        place: '',
        status: '',
        pic: '',
        phone: '',
        principal: '',
    })
    nextTick(() => {
        formRef.value.clearValidate('name')
        formRef.value.clearValidate('place')
        formRef.value.clearValidate('status')
        formRef.value.clearValidate('pic')
        formRef.value.clearValidate('phone')
        formRef.value.clearValidate('principal')
    })
}

//窗口保存按钮
const save = async () => {
    let res: any = await reqAddOrUpdate(Params)
    if (res.code == 200) {
        drawer.value = false
        ElMessage({
            type: 'success',
            message: Params.id ? '更新成功' : '添加成功',
        })
        // window.location.reload()
        getHasPlace()
    } else {
        drawer.value = false
        ElMessage({
            type: 'error',
            message: Params.id ? '更新失败' : '添加失败',
        })
    }
}
import type { UploadProps } from 'element-plus'
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
</script>

<style scoped lang="scss"></style>
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