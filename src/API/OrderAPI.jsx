import axiosClient from "./axiosClient";

const OrderAPI = {
  post_order: (data) => {
    const url = `/api/createOrder`;
    return axiosClient.post(url, data);
  },

  get_order: (id) => {
    const url = `/api/Payment/order/${id}`;
    return axiosClient.get(url);
  },

  get_detail: (id) => {
    const url = `/api/Payment/order/detail/${id}`;
    return axiosClient.get(url);
  },

  get_order_by_user: (user_id) => {
    const url = `/api/getOrderByUser/${user_id}`;
    return axiosClient.post(url, {}); // orz
  },
  post_email: (data) => {
    const url = `/api/Payment/email`;
    return axiosClient.post(url, data);
  },

  cancel_order: (query) => {
    const url = `/api/admin/Order/cancelorder${query}`;
    return axiosClient.patch(url);
  },
};

export default OrderAPI;
