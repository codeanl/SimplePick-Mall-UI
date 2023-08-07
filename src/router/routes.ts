//对外暴露配置路由


// export const constantRoute = [
//     {
//         path: '/login',
//         component: () => import('@/view/login/index.vue'),
//         name: 'login',
//         meta: {
//             title: 'login',
//             hidden: true,
//         },
//     },
//     {
//         path: '/',
//         component: () => import('@/view/layout/index.vue'),
//         name: 'layout',
//         meta: {
//             title: '',
//             hidden: false,
//             icon: '',
//         },
//         redirect: '/home',
//         children: [
//             {
//                 path: '/home',
//                 component: () => import('@/view/home/index.vue'),
//                 meta: {
//                     title: '首页',
//                     hidden: false,
//                     icon: 'HomeFilled',
//                 },
//             },
//         ],
//     },
//     {
//         path: '/404',
//         component: () => import('@/view/404/index.vue'),
//         name: '404',
//         meta: {
//             title: '404',
//             hidden: true,
//         },
//     },
// ]

// export const asyncRoute = [
//     {
//         path: '/sys',
//         component: () => import('@/view/layout/index.vue'),
//         name: 'Sys',
//         meta: {
//             title: '系统管理',
//             hidden: false,
//             icon: 'Setting',
//         },
//         children: [
//             {
//                 path: '/sys/member',
//                 component: () => import('@/view/sys/member/index.vue'),
//                 name: 'member',
//                 meta: {
//                     title: '用户管理',
//                     hidden: false,
//                     icon: 'User',
//                 },
//             },
//             {
//                 path: '/sys/role',
//                 component: () => import('@/view/sys/role/index.vue'),
//                 name: 'role',
//                 meta: {
//                     title: '角色管理',
//                     hidden: false,
//                     icon: 'User',
//                 },
//             },
//             {
//                 path: '/sys/menu',
//                 component: () => import('@/view/sys/menu/index.vue'),
//                 name: 'menu',
//                 meta: {
//                     title: '菜单管理',
//                     hidden: false,
//                     icon: 'User',
//                 },
//             },
//         ],
//     },
//     {
//         path: '/ums',
//         component: () => import('@/view/layout/index.vue'),
//         name: 'Ums',
//         meta: {
//             title: '商品管理  ',
//             hidden: false,
//             icon: 'Lock',
//         },
//         redirect: '/ums/product',
//         children: [
//             {
//                 path: '/ums/product',
//                 // component: () => import('@/views/ums/product/index.vue'),
//                 name: 'User',
//                 meta: {
//                     title: '商品管理',
//                     hidden: false,
//                     icon: 'User',
//                 },
//             },
//             {
//                 path: '/ums/category',
//                 // component: () => import('@/views/sys/category/index.vue'),
//                 name: 'Role',
//                 meta: {
//                     title: '分类管理',
//                     hidden: false,
//                     icon: 'Avatar',
//                 },
//             },
//         ],
//     },
// ]

// export const anyRoute = {
//     path: '/:pathMatch(.*)*',
//     redirect: '/404',
//     name: 'Any',
//     meta: {
//         title: '任意路由',
//         hidden: true,
//     },
// }


export const constantRoute = [
    {
        path: '/login',
        component: () => import('@/view/login/index.vue'),
        name: 'login',
        meta: {
            title: 'login',
            hidden: true,
        },
    },
    {
        path: '/',
        component: () => import('@/view/layout/index.vue'),
        name: 'layout',
        meta: {
            title: '',
            hidden: false,
            icon: '',
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/view/home/index.vue'),
                meta: {
                    title: '首页',
                    hidden: false,
                    icon: 'HomeFilled',
                },
            },
        ],
    },
    {
        path: '/404',
        component: () => import('@/view/404/index.vue'),
        name: '404',
        meta: {
            title: '404',
            hidden: true,
        },
    },
]

export const asyncRoute = [
    {
        path: '/acl',
        component: () => import('@/view/layout/index.vue'),
        name: 'Acl',
        meta: {
            title: '权限管理',
            hidden: false,
            icon: 'Lock',
        },
        redirect: '/acl/user',
        children: [
            {
                path: '/acl/user',
                component: () => import('@/view/sys/member/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    hidden: false,
                    icon: 'User',
                },
            },
            {
                path: '/acl/role',
                component: () => import('@/view/sys/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    hidden: false,
                    icon: 'Avatar',
                },
            },
            {
                path: '/acl/permission',
                component: () => import('@/view/sys/menu/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    hidden: false,
                    icon: 'List',
                },
            },
        ],
    },
    {
        path: '/pms',
        component: () => import('@/view/layout/index.vue'),
        name: 'Product',
        meta: {
            title: '商品管理',
            hidden: false,
            icon: 'Goods',
        },
        redirect: '/pms/brand',
        children: [
            {
                path: '/pms/brand',
                component: () => import('@/view/pms/brand/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',
                    icon: 'ShoppingCart',
                    hidden: false,
                },
            },
            {
                path: '/pms/attr',
                component: () => import('@/view/pms/attr/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',
                    icon: 'Management',
                    hidden: false,
                },
            },
            {
                path: '/pms/product',
                component: () => import('@/view/pms/product/index.vue'),
                name: 'Spu',
                meta: {
                    title: '商品管理',
                    icon: 'SetUp',
                    hidden: false,
                },
            },
        ],
    },
]

export const anyRoute = {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
        title: '任意路由',
        hidden: true,
    },
}
