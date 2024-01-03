import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { changeCount } from '../Redux/Action/ActionCount';
import { default as CartAPI } from '../API/CartAPI';

Cart.propTypes = {

};

function Cart(props) {

    const dispatch = useDispatch()

    const [list_carts, set_list_carts] = useState([])

    // state get from redux
    const count_change = useSelector(state => state.Count.isLoad)

    const [total_price, set_total_price] = useState(0)

    const user_id = sessionStorage.getItem('id_user')

    // Hàm này dùng để hiện thị danh sách sản phẩm đã thêm vào giỏ hàng
    // và tính tổng tiền
    useEffect(() => {
        CartAPI.getCartsByUser({ user_id: user_id })
            .then(r => {
                console.log(r)
                set_list_carts(r.dishDetails)
                set_total_price(r.total)
            })


    }, [count_change])

    // Hàm này dùng để xóa giỏ hàng
    const handler_delete_carts = dish_id => {

        CartAPI.removeCart({
            user_id: parseInt(user_id),
            dish_id: parseInt(dish_id)
        })
            .then(r => {
                const action_change_count = changeCount(count_change);
                dispatch(action_change_count);
            })

    }

    // Hàm này này dùng để kiểm tra đăng nhập checkout
    const [show_error, set_show_error] = useState(false)

    const [show_null_cart, set_show_null_cart] = useState(false)

    const handler_checkout = () => {

        if (user_id) {
            if (list_carts.length < 1) {
                set_show_null_cart(true)
            } else {
                window.location.replace('/checkout')
            }
        } else {

            set_show_error(true)

        }

        setTimeout(() => {
            set_show_error(false)
            set_show_null_cart(false)
        }, 1500)

    }

    return (
        <div>
            {
                show_error &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff', backgroundColor: '#f84545' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Vui Lòng Kiểm Tra Tình Trạng Đăng Nhập!</h4>
                    </div>
                </div>
            }
            {
                show_null_cart &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff', backgroundColor: '#f84545' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Vui Lòng Kiểm Tra Lại Giỏ Hàng!</h4>
                    </div>
                </div>
            }

            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li className="active">Shopping Cart</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="Shopping-cart-area pt-60 pb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <form action="#">
                                <div className="table-content table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="li-product-remove">remove</th>
                                                <th className="cart-product-name">Product</th>
                                                <th className="li-product-price">Price</th>
                                                <th className="li-product-quantity">Quantity</th>
                                                <th className="li-product-subtotal">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                list_carts && list_carts.map((value, index) => (
                                                    <tr key={index}>
                                                        <td className="li-product-remove" onClick={() => handler_delete_carts(value.dish_id)}>
                                                            <a style={{ cursor: 'pointer' }}><i className="fa fa-times"></i></a>
                                                        </td>
                                                        <td className="li-product-name"><a href={`detail/${value.dish_id}`}>{value.dish_name}</a></td>
                                                        <td className="li-product-price"><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(value.price) + ' VNĐ'}</span></td>
                                                        <td className="li-product-price">{value.quantity}</td>
                                                        <td className="product-subtotal"><span className="amount">{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(parseInt(value.price) * parseInt(value.quantity)) + ' VNĐ'}</span></td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="row">
                                    <div className="col-md-5 ml-auto">
                                        <div className="cart-page-total">
                                            <h2>Cart totals</h2>
                                            <ul>
                                                <li>Total <span>{new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(total_price) + ' VNĐ'}</span></li>
                                            </ul>
                                            <a style={{ color: '#fff', cursor: 'pointer', fontWeight: '600' }} onClick={handler_checkout}>Proceed to checkout</a>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;