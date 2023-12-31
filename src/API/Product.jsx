import axiosClient from './axiosClient'

const Product = {

    Get_All_Product: () => {
        const url = '/api/dishesShowAll'
        return axiosClient.get(url)
    },
    Get_Detail_Product: (id) => {
        const url = `/api/dishes/${id}`
        return axiosClient.get(url)
    },
    Put_Dish: (data) => {
        const url = `/api/dishesUpdate`
        return axiosClient.put(url,data)
    },
    Delete: (id) => {
        const url = `/api/dishesDelete/${id}`
        return axiosClient.delete(url)
    },
   



    Get_Category_Gender: (query) => {
        const url = `/api/Product/category/gender${query}`
        return axiosClient.get(url)
    },

    Get_Pagination: (query) => {
        const url = `/api/Product/category/pagination${query}`
        return axiosClient.get(url)
    },

    get_search_list: (input) => {
        const url = `/api/search/${input}`
        return axiosClient.get(url)
    },
    Get_Category_Product: (query) => {
        const url = `/api/Product/category${query}`
        return axiosClient.get(url)
    }
}

export default Product