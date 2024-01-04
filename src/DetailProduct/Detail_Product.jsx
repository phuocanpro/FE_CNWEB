import React, { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { useParams } from 'react-router';
import Product from '../API/Dishes';
import { useDispatch, useSelector } from 'react-redux';
import { changeCount } from '../Redux/Action/ActionCount';
import { Link } from 'react-router-dom';
import Cart from '../API/CartAPI';
import '../API/CartAPI'
import Image from '../Image/Global';

Detail_Product.propTypes = {

};

function Detail_Product(props) {

    const { id } = useParams()

    const [product, set_product] = useState({})

    const dispatch = useDispatch()

    // Get count từ redux khi user chưa đăng nhập
    const count_change = useSelector(state => state.Count.isLoad)

    const [count, set_count] = useState(1)

    const [show_success, set_show_success] = useState(false)

    // Hàm này dùng để gọi API hiển thị sản phẩm
    useEffect(() => {

        const fetchData = async () => {

            const response = await Product.Get_Detail_Product(id)
            set_product(response[0])
        }

        fetchData()

    }, [])


    // Hàm này dùng để thêm vào giỏ hàng
    const handler_addcart = (e) => {

        e.preventDefault()

        const data = {
            user_id: parseInt(sessionStorage.getItem('id_user')),
            dish_id: parseInt(id),
            quantity: count
        }

        Cart.addCart(data).
            then(r => {
                const action_count_change = changeCount(count_change)
                dispatch(action_count_change)

                set_show_success(true)

                setTimeout(() => {
                    set_show_success(false)
                }, 1000)
            })
            .catch(e => console.log(e))
    }



    // Hàm này dùng để giảm số lượng
    const downCount = () => {
        if (count === 1) {
            return
        }

        set_count(count - 1)
    }

    const upCount = () => {
        set_count(count + 1)
    }

    return (
        <div>
            {
                show_success &&
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Bạn Đã Thêm Hàng Thành Công!</h4>
                    </div>
                </div>
            }

            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li className="active">Detail</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="content-wraper">
                <div className="container">
                    <div className="row single-product-area">
                        <div className="col-lg-5 col-md-6">
                            <div className="product-details-left">
                                <div className="product-details-images slider-navigation-1">
                                    <div className="lg-image">
                                        <img src={product.img} alt={product.name} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7 col-md-6">
                            <div className="product-details-view-content pt-60">
                                <div className="product-info">
                                    <h2>{product.name}</h2>
                                    <div className="product-desc">
                                        <p>
                                            <span>{product.description}</span>
                                        </p>
                                    </div>
                                    <div className="single-add-to-cart">
                                        <form action="#" className="cart-quantity">
                                            <div className="quantity">
                                                <label>Quantity</label>
                                                <div className="cart-plus-minus">
                                                    <input className="cart-plus-minus-box" value={count} type="text" onChange={(e) => set_count(e.target.value)} />
                                                    <div className="dec qtybutton" onClick={downCount}><i className="fa fa-angle-down"></i></div>
                                                    <div className="inc qtybutton" onClick={upCount}><i className="fa fa-angle-up"></i></div>
                                                </div>
                                            </div>
                                            <a href="#" className="add-to-cart" type="submit" onClick={handler_addcart}>Add to cart</a>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-area pt-35">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="li-product-tab">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail_Product;