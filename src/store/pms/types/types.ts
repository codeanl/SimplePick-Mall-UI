import type { CategoryObj } from '@/api/pms/attr/type'
export interface CategoryState {
    c1ID: string | number
    c2ID: string | number
    c3ID: string | number
    c1Arr: CategoryObj[]
    c2Arr: CategoryObj[]
    c3Arr: CategoryObj[]
}

