//对外暴露配置路由
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
        path: '/sys',
        component: () => import('@/view/layout/index.vue'),
        name: 'Sys',
        meta: {
            title: '权限管理',
            hidden: false,
            icon: 'Lock',
        },
        redirect: '/sys/user',
        children: [
            {
                path: '/sys/user',
                component: () => import('@/view/sys/member/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    hidden: false,
                    icon: 'User',
                },
            },
            {
                path: '/sys/role',
                component: () => import('@/view/sys/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    hidden: false,
                    icon: 'Avatar',
                },
            },
            {
                path: '/sys/menu',
                component: () => import('@/view/sys/menu/index.vue'),
                name: 'Menu',
                meta: {
                    title: '菜单管理',
                    hidden: false,
                    icon: 'List',
                },
            },
            {
                path: '/sys/place',
                component: () => import('@/view/sys/place/index.vue'),
                name: 'Place',
                meta: {
                    title: '自提点管理',
                    hidden: false,
                    icon: 'List',
                },
            },
        ],
    },
    {
        path: '/pms',
        component: () => import('@/view/layout/index.vue'),
        name: 'Pms',
        meta: {
            title: '商品管理',
            hidden: false,
            icon: 'Goods',
        },
        redirect: '/pms/category',
        children: [
            {
                path: '/pms/category',
                component: () => import('@/view/pms/category/index.vue'),
                name: 'Category',
                meta: {
                    title: '分类管理',
                    icon: 'Management',
                    hidden: false,
                },
            },
            {
                path: '/pms/attribute',
                component: () => import('@/view/pms/attribute/index.vue'),
                name: 'Attribute',
                meta: {
                    title: '属性管理',
                    icon: 'Management',
                    hidden: false,
                },
            },
            {
                path: '/pms/product',
                component: () => import('@/view/pms/product/index.vue'),
                name: 'Product',
                meta: {
                    title: '商品管理',
                    icon: 'SetUp',
                    hidden: false,
                },
            },
        ],
    },
    {
        path: '/log',
        component: () => import('@/view/layout/index.vue'),
        name: 'Log',
        meta: {
            title: '日志管理',
            hidden: false,
            icon: 'Goods',
        },
        redirect: '/log/loginLog',
        children: [
            {
                path: '/log/loginLog',
                component: () => import('@/view/log/loginLog/index.vue'),
                name: 'LoginLog',
                meta: {
                    title: '登录日志',
                    icon: 'ShoppingCart',
                    hidden: false,
                },
            },
            {
                path: '/log/sysLog',
                component: () => import('@/view/log/sysLog/index.vue'),
                name: 'SysLog',
                meta: {
                    title: '系统日志',
                    icon: 'Management',
                    hidden: false,
                },
            },
        ],
    },
    {
        path: '/ums',
        component: () => import('@/view/layout/index.vue'),
        name: 'Ums',
        meta: {
            title: '会员管理',
            hidden: false,
            icon: 'Goods',
        },
        redirect: '/ums/member',
        children: [
            {
                path: '/ums/member',
                component: () => import('@/view/ums/member/index.vue'),
                name: 'Member',
                meta: {
                    title: '会员管理',
                    icon: 'ShoppingCart',
                    hidden: false,
                },
            },

        ],
    },
    {
        path: '/sms',
        component: () => import('@/view/layout/index.vue'),
        name: 'Sms',
        meta: {
            title: '营销管理',
            hidden: false,
            icon: 'Goods',
        },
        redirect: '/sms/coupon',
        children: [
            {
                path: '/sms/homeAdvertise',
                component: () => import('@/view/sms/homeAdvertise/index.vue'),
                name: 'HomeAdvertise',
                meta: {
                    title: '广告管理',
                    icon: 'ShoppingCart',
                    hidden: false,
                },
            },
            {
                path: '/sms/coupon',
                component: () => import('@/view/sms/coupon/index.vue'),
                name: 'Coupon',
                meta: {
                    title: '优惠券管理',
                    icon: 'ShoppingCart',
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
