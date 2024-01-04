import axiosClient from './axiosClient'

const Cart = {

    addCart: (data) => {
        const url = `/api/addCart`
        return axiosClient.post(url, data)
    },

    getQuantity: (user_id) => {
        const url = '/api/getQuantity'
        return axiosClient.post(url, user_id)
    },

    getCartsByUser: user_id => {
        const url = `/api/getItemCart`
        return axiosClient.post(url, user_id)
    },

    removeCart: data => {
        const url = `/api/removeItemCart?user_id=${data.user_id}&dish_id=${data.dish_id}`
        console.log(data)
        return axiosClient.delete(url)
    },

    removeAllCarts: user_id => {
        const url = `/api/removeAllCart?user_id=${user_id}`
        return axiosClient.delete(url)
    }

}

export default Cart