//路由鉴权
import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from './store'
import useUserStore from './store/sys/user'
let userStore = useUserStore(pinia)

import setting from './setting'
// 全局前置守卫  保护访问路由的访问权限,也就是对路由权限进行控制
// 只有在允许特定的情况下才能访问某个固定的路由,具备查看某些页面的权限,
// router.beforeEach(async (to, from, next) => {
//     document.title = to.meta.title + ` | ${setting.title}`
//     // nprogress进度条插件
//     nprogress.start()
//     let token = userStore.token
//     let username = userStore.username
//     if (token) {
//         // next()
//         if (username) {
//             next()
//         } else {
//             try {
//                 await userStore.userInfo()
//                 //刷新的时候是异步路由 有可能获取到用户信息异步路由还没有加载完步 出现空白的效果
//                 next({ ...to, replace: true })
//             } catch (error) {
//                 next({ path: '/login' })
//             }
//         }
//         // if (to.path === '/login') {
//         //     next({ path: '/' })
//         // } else {
//         //     if (username) {
//         //         next()
//         //     } else {
//         //         try {
//         //             await userStore.userInfo()
//         //             //刷新的时候是异步路由 有可能获取到用户信息异步路由还没有加载完步 出现空白的效果
//         //             next({ ...to, replace: true })
//         //         } catch (error) {
//         //             next({ path: '/login' })
//         //         }
//         //     }
//         // }
//     } else {
//         if (to.path == '/login') {
//             next()
//         } else {
//             next({ path: '/login' })
//             await userStore.userLogout()
//         }
//     }
// })
router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title + ` | ${setting.title}`
    nprogress.start()
    let token = userStore.token
    let username = userStore.username
    if (to.path === '/login' || to.path === '/merchantApply') {
        next()
    } else if (token) {
        if (username) {
            next()
        } else {
            try {
                await userStore.userInfo()
                next({ ...to, replace: true })
            } catch (error) {
                console.error(error)
                next({ path: '/login' })
            }
        }
    } else {
        next({ path: '/login' })
        try {
            await userStore.userLogout()
        } catch (error) {
            console.error(error)
        }
    }
})
//全局后置守卫
router.afterEach((to: any, from: any) => {
    nprogress.done()
})

//未登录 可以访问login
//登录成功 不可以访问login   