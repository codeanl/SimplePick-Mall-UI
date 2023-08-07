<template>
    <!-- 上边搜索 -->
    <el-card style="height: 80px">
        <el-form :inline="true" class="form">
            <el-form-item label="用户名:">
                <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="search" :disabled="keyword.length ? false : true">
                    搜索
                </el-button>
                <el-button size="default" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <!-- 数据列表 -->
    <el-card style="margin: 10px 0">
        <el-button type="success" size="default" @click="addUser">
            添加用户
        </el-button>
        <el-button type="danger" size="default" @click="deleteSelectUser" :disabled="selectIdArr.length ? false : true">
            批量删除
        </el-button>
        <el-table style="margin: 10px 0" border :data="userArr" @selection-change="selectChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="id" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户昵称" align="center" prop="nickname" show-overflow-tooltip></el-table-column>
            <el-table-column label="性别" align="center" prop="gender" show-overflow-tooltip></el-table-column>
            <el-table-column label="邮箱" align="center" prop="email" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" align="center" prop="creat_at" show-overflow-tooltip></el-table-column>
            <el-table-column label="更新时间" align="center" prop="update_at" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="300px" align="center">
                <template #="{ row, $index }">
                    <el-button type="warning" size="small" icon="User" @click="setRole(row)">
                        分配角色
                    </el-button>
                    <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">
                        编辑
                    </el-button>
                    <el-popconfirm :title="`你确定删除${row.username}`" width="260px" @confirm="deleteUser(row.id)">
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
        <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
            :background="true" layout="prev, pager, next, jumper, -> , sizes, total" :total="total"
            @current-change="getHasUser" @size-change="handler" />
    </el-card>
    <!-- 抽屉  完成 添加｜修改 的窗口 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
        </template>
        <template #default>
            <el-form :model="userParams" :rules="rules" ref="formRef">
                <el-form-item label="用户姓名" prop="username">
                    <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="name">
                    <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
                </el-form-item>
                <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                    <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </div>
        </template>
    </el-drawer>
    <!-- 抽屉  职位分配 -->
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>分配角色</h4>
        </template>
        <template #default>
            <el-form>
                <el-form-item label="用户姓名">
                    <el-input v-model="userParams.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="职位列表">
                    <!-- indeterminate不确定状态 -->
                    <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
                        全选
                    </el-checkbox>
                    <el-checkbox-group v-model="userRole" @change="handleCheckedUsersChange">
                        <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">
                            {{ role.roleName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="drawer1 = false">取消</el-button>
                <el-button type="primary" @click="confirmClick">确定</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import {
    reqUserInfo,
    reqAddOrUpdateUser,
    reqAllRole,
    reqSetUserRole,
    reqRemoveUser,
    reqSelectUser,
} from '@/api/sys/user'
import type {
    UserResponseData,
    Records,
    User,
    AllRoleResponseData,
    AllRole,
    SetRoleData,

} from '@/api/acl/user/type'
import { ref, onMounted, reactive, nextTick } from 'vue'
//默认页码
let pageNo = ref<number>(1)
//默认个数
let pageSize = ref<number>(5)
let total = ref<number>(0)
//数据列表
let userArr = ref<Records>([])
//收集用户查找的关键字
let keyword = ref<string>('')
//收集用户信息
let userParams = reactive<User>({
    username: '',
    name: '',
    password: '',
})
//组件实例
let formRef = ref<any>()
//全选框
const checkAll = ref<boolean>(false)
//不确定样式
const isIndeterminate = ref<boolean>(true)
//所有role
let allRole = ref<AllRole>([])
// 用户role
let userRole = ref<AllRole>([])
//准备批量删除用户的id
let selectIdArr = ref<User[]>([])
//setting仓库
import useLayoutSettingStore from '@/store/setting'
let settingStore = useLayoutSettingStore()
//组件挂载完毕
onMounted(() => {
    getHasUser()
})
//获取用户信息
const getHasUser = async (pager = 1) => {
    pageNo.value = pager
    let res: any = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
    if (res.code == 200) {
        total.value = res.total
        userArr.value = res.data
    }
}
//下拉改变
const handler = () => {
    getHasUser()
}
//定义响应式数据 抽屉的显示隐藏
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)

//添加用户按钮
const addUser = () => {
    drawer.value = true
    //存储收集已有的账号信息
    Object.assign(userParams, {
        id: 0,
        username: '',
        name: '',
        password: '',
    })

    //清除上一次的提示信息
    nextTick(() => {
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
        formRef.value.clearValidate('password')
    })
}

// 编辑按钮
const updateUser = (row: User) => {
    drawer.value = true
    Object.assign(userParams, row)
    nextTick(() => {
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
    })
}


//表单校验 自定义
const validatorUserName = (rule: any, value: any, callBack: any) => {
    if (value.trim().length >= 5) {
        callBack()
    } else {
        callBack(new Error('用户名字至少五位'))
    }
}
const validatorName = (rule: any, value: any, callBack: any) => {
    if (value.trim().length >= 5) {
        callBack()
    } else {
        callBack(new Error('用户昵称至少五位'))
    }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
    if (value.trim().length >= 5) {
        callBack()
    } else {
        callBack(new Error('用户密码至少六位'))
    }
}
const rules = {
    username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
    name: [{ required: true, trigger: 'blur', validator: validatorName }],
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

//窗口保存按钮
const save = async () => {
    await formRef.value.validate()
    let res: any = await reqAddOrUpdateUser(userParams)
    if (res.code == 200) {
        drawer.value = false
        ElMessage({
            type: 'success',
            message: userParams.id ? '更新成功' : '添加成功',
        })
        //更新留在当前页 添加回到第一页
        // getHasUser(userParams.id ? pageNo.value : 1)
        window.location.reload()
    } else {
        drawer.value = false
        ElMessage({
            type: 'error',
            message: userParams.id ? '更新失败' : '添加失败',
        })
    }
}
//取消按钮
const cancel = () => {
    drawer.value = false
}
//分配角色按钮
const setRole = async (row: User) => {
    drawer1.value = true
    Object.assign(userParams, row)
    let res: AllRoleResponseData = await reqAllRole(userParams.id as number)
    if (res.code === 200) {
        allRole.value = res.data.allRolesList
        userRole.value = res.data.assignRoles
        drawer1.value = true
    }
}
//点击全选框
const handleCheckAllChange = (val: boolean) => {
    userRole.value = val ? allRole.value : [] //全选就把所有的role给它 否者为空
    isIndeterminate.value = false
}
//底部复选框change事件
const handleCheckedUsersChange = (value: string[]) => {
    // 已经勾选的长度
    const checkedCount = value.length
    checkAll.value = checkedCount === allRole.value.length//boolean 不确定样式
    isIndeterminate.value =
        checkedCount > 0 && checkedCount < allRole.value.length
}

//分配菜单 确定按钮
const confirmClick = async () => {
    let data: SetRoleData = {
        userId: userParams.id as number,
        roleIdList: userRole.value.map((item) => {
            return item.id as number
        }),
    }
    let res: any = await reqSetUserRole(data)
    if (res.code === 200) {
        ElMessage({
            type: 'success',
            message: '分配职务成功',
        })
        drawer1.value = false
        getHasUser(pageNo.value)
    }
}
// 删除用户按钮
const deleteUser = async (userId: number) => {
    let res: any = await reqRemoveUser(userId)
    if (res.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
//复选框选择
const selectChange = (value: any) => {
    selectIdArr.value = value
}
//批量删除用户按钮
const deleteSelectUser = async () => {
    let idList: any = selectIdArr.value.map((item) => {
        return item.id
    })
    let res: any = await reqSelectUser(idList)
    if (res.code === 200) {
        ElMessage({ type: 'success', message: '删除成功' })
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}

//搜索按钮
const search = () => {
    getHasUser()
    keyword.value = ''
}
//重置按钮
const reset = () => {
    settingStore.refresh = !settingStore.refresh
}
</script>

<style scoped lang="scss">
.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>