import React, { useEffect, useState } from "react";
import "./Checkout.css";
import OrderAPI from "../API/OrderAPI";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import { changeCount } from "../Redux/Action/ActionCount";
import { useDispatch, useSelector } from "react-redux";
import Cart from "../API/CartAPI.jsx";
import User from "../API/User.jsx";

Checkout.propTypes = {};

function Checkout(props) {
  const [stateUserDetails, setStateUserDetails] = useState({
    id: "",
    address: "",
  });

  const [orderID, setOrderID] = useState("");

  const [carts, set_carts] = useState([]);

  const [total_price, set_total_price] = useState(0);

  const [discount, set_discount] = useState(0);

  // state load_map
  const [load_map, set_load_map] = useState(true);

  // state load_order
  const [load_order_status, set_load_order_status] = useState(false);

  const [check_action, set_check_action] = useState(false);

  const user_id = sessionStorage.getItem("id_user");
  setStateUserDetails({ id: user_id });
  const [user, setUser] = useState({});

  useEffect(() => {
    User.Get_User(user_id).then((r) => {
      console.log(r);
      setUser(r);
    });
  }, []);

  useEffect(() => {
    if (check_action) {
      Cart.getCartsByUser({ user_id: user_id }).then((r) => {
        set_carts(r.dishDetails);
        set_total_price(r.total);
        set_check_action(false);
      });
    }
  }, [check_action]);

  const [show_error, set_show_error] = useState(false);

  const [information, set_information] = useState({
    fullname: "",
    phone: "",
    address: "",
    email: "",
  });

  const onChangeFullname = (e) => {
    set_information({
      fullname: e.target.value,
      phone: information.phone,
      address: information.address,
      email: information.email,
    });
  };
  const onChangePhone = (e) => {
    set_information({
      fullname: information.fullname,
      phone: e.target.value,
      address: information.address,
      email: information.email,
    });
  };

  const onChangeAddress = (e) => {
    set_information({
      fullname: information.fullname,
      phone: information.phone,
      address: e.target.value,
      email: information.email,
    });
  };
  const onChangeEmail = (e) => {
    set_information({
      fullname: information.fullname,
      phone: information.phone,
      address: information.address,
      email: e.target.value,
    });
  };

  // Hàm này dùng để check validation cho paypal
  useEffect(() => {
    checkValidation();
  }, [information]);

  // Kiểm tra Paypal
  function checkValidation() {
    if (information.fullname === "") {
      set_show_error(true);
    } else {
      if (information.phone === "") {
        set_show_error(true);
      } else {
        if (information.email === "") {
          localStorage.setItem("information", JSON.stringify(information));

          set_show_error(true);
        } else {
          set_show_error(false);
        }
      }
    }
  }

  const { register, handleSubmit, errors } = useForm();

  const [redirect, set_redirect] = useState(false);

  const [load_order, set_load_order] = useState(false);

  const count_change = useSelector((state) => state.Count.isLoad);

  const dispatch = useDispatch();

  // Hàm này dùng để thanh toán offline
  const handler_Checkout = async (data) => {
    set_load_order(true);

    OrderAPI.post_order({
      user_id: user_id,
      dishes: carts,
    }).then((r) => {
      if (r.status !== "error") {
        set_redirect(true);

        // Hàm này dùng để load lại phần header bằng Redux
        const action_count_change = changeCount(count_change);
        dispatch(action_count_change);
      }
    });
  };

  const Change_Load_Order = (value) => {
    set_load_order(value);
  };

  //--------------- Xử lý Google API ------------------//

  const [error_address, set_error_address] = useState(false);

  const [from, set_from] = useState(
    "470 Trần Đại Nghĩa, Hòa Quý, Ngũ hành Sơn, Đà nẵng"
  );

  // Khoảng cách
  const [distance, set_distance] = useState("");

  // Thời gian đi trong bn phút
  const [duration, set_duration] = useState("");

  // Giá tiền
  const [price, set_price] = useState("");

  // Kiểm tra xem khách hàng đã nhập chỉ nhận hàng hay chưa
  const handler_Next = () => {
    if (!information.address) {
      set_error_address(true);
      return;
    }

    // Sau khi mà đổ dữ liệu ở bên Jquery xong
    // thì qua bên này mình sẽ lấy những giá trị vừa xử lý

    const kilo = document.getElementById("in_kilo").innerHTML;
    const duration_text = document.getElementById("duration_text").innerHTML;
    const price_shipping = document.getElementById("price_shipping").innerHTML;
    const to_places = document.getElementById("to_places").value;

    setStateUserDetails({ address: to_places });
    const res = User.Put_User(stateUserDetails);
    console.log("res", res);

    console.log(kilo);
    console.log(duration_text);
    console.log(price_shipping);

    set_distance(kilo);
    set_duration(duration_text);

    localStorage.setItem("price", price_shipping);
    set_price(price_shipping);
    const dispatch = useDispatch()

    // Hàm này dùng để thanh toán offline
    const handler_Checkout = async (data) => {

        set_load_order(true)

        OrderAPI.post_order({
            user_id: user_id,
            dishes: carts,
        })
            .then(r => {
                if (r.status !== 'error') {
                    Cart.removeAllCarts(user_id)
                        .then(r => {
                            console.log(r)
                            if (r.status === 'success') {
                                set_redirect(true)

                                // Hàm này dùng để load lại phần header bằng Redux
                                const action_count_change = changeCount(count_change)
                                dispatch(action_count_change)
                            }
                        })
                }
            })

    set_information({
      fullname: information.fullname,
      phone: information.phone,
      address: to_places,
      email: information.email,
    });
    if (kilo) {
      set_load_map(false);
      set_load_order_status(true); // Hiển thị phần checkout
      set_check_action(true);
    }
  };

  return (
    <div>
      {load_order && (
        <div className="wrapper_loader">
          <div className="loader"></div>
        </div>
      )}

      <div className="breadcrumb-area">
        <div className="container">
          <div className="breadcrumb-content">
            <ul>
              <li>
                <a href="index.html">Home</a>
              </li>
              <li className="active">Checkout</li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{ paddingTop: "3rem", paddingBottom: "3rem" }}
      >
        {load_map && (
          <div className="row">
            <div className="col-lg-6 col-12 pb-5">
              <div className="checkbox-form">
                <h3>Check Distance</h3>
                <div className="row">
                  <div className="col-md-12">
                    <div className="checkout-form-list">
                      <label>
                        From <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="from"
                        id="from_places"
                        disabled="true"
                        value={from}
                      />
                      <input
                        id="origin"
                        name="origin"
                        required=""
                        type="hidden"
                        value={from}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="checkout-form-list">
                      <label>
                        To <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="to_places"
                        placeholder="Enter A Location"
                        value={information.address}
                        onChange={onChangeAddress}
                      />
                      {error_address && (
                        <span style={{ color: "red" }}>
                          * Address is required
                        </span>
                      )}
                      <input
                        id="destination"
                        type="text"
                        name="destination"
                        required=""
                        type="hidden"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="checkout-form-list">
                      <div className="form-group">
                        <label>Travel Mode</label>
                        <select id="travel_mode" name="travel_mode">
                          <option value="DRIVING">DRIVING</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div id="result" className="hide">
                      <div>
                        <label htmlFor="Kilometers">Kilometers: </label>&nbsp;
                        <label id="in_kilo"></label>
                      </div>
                      <div>
                        <label htmlFor="Duration">Duration: </label>&nbsp;
                        <label id="duration_text"></label>
                      </div>
                      <div>
                        <label htmlFor="Price">Shipping Cost: </label>&nbsp;
                        <label id="price_shipping"></label>
                        &nbsp;<label>VNĐ</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="order-button-payment">
                      <input
                        value="CHECKING"
                        type="submit"
                        id="distance_form"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="d-flex justify-content-end">
                      <div className="order-button-payment">
                        <input
                          value="Next"
                          onClick={handler_Next}
                          id="distance_next"
                          type="submit"
                          style={{ padding: ".4rem 1.6rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-12">
              <div id="map" style={{ height: "400px", width: "500px" }}></div>
            </div>
          </div>
        )}
        {load_order_status && (
          <div className="row">
            <div className="col-lg-6 col-12 pb-5">
              <form onSubmit={handleSubmit(handler_Checkout)}>
                <div className="checkbox-form">
                  <h3>Billing Details</h3>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <label>
                          Full Name <span className="required">*</span>
                        </label>
                        <input
                          placeholder="Enter Fullname"
                          type="text"
                          name="fullname"
                          disabled={true}
                          ref={register({ required: true })}
                          value={user.name}
                          onChange={onChangeFullname}
                        />
                        {errors.fullname &&
                          errors.fullname.type === "required" && (
                            <span style={{ color: "red" }}>
                              * Fullname is required
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <label>
                          Phone Number <span className="required">*</span>
                        </label>
                        <input
                          placeholder="Enter Phone Number"
                          type="text"
                          name="phone"
                          disabled={true}
                          ref={register({ required: true })}
                          value={user.phone}
                          onChange={onChangePhone}
                        />
                        {errors.phone && errors.phone.type === "required" && (
                          <span style={{ color: "red" }}>
                            * Phone Number is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <label>
                          Address <span className="required">*</span>
                        </label>
                        <input
                          placeholder="Street address"
                          type="text"
                          name="address"
                          ref={register({ required: true })}
                          value={information.address}
                          onChange={onChangeAddress}
                          disabled="true"
                        />
                        {errors.address &&
                          errors.address.type === "required" && (
                            <span style={{ color: "red" }}>
                              * Address is required
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="checkout-form-list">
                        <label>
                          Email <span className="required">*</span>
                        </label>
                        <input
                          placeholder="Enter Email"
                          type="email"
                          name="email"
                          disabled={true}
                          ref={register({ required: true })}
                          value={user.email}
                          onChange={onChangeEmail}
                        />
                        {errors.email && errors.email.type === "required" && (
                          <span style={{ color: "red" }}>
                            * Email is required
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="order-button-payment">
                        {redirect && <Redirect to="/success" />}
                        <input value="Place order" type="submit" />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-6 col-12">
              <div className="your-order">
                <h3>Your order</h3>
                <div className="your-order-table table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="cart-product-name">Product</th>
                        <th className="cart-product-total">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carts &&
                        carts.map((value) => (
                          <tr className="cart_item" key={value._id}>
                            <td className="cart-product-name">
                              {value.dish_name}
                              <strong className="product-quantity">
                                {" "}
                                × {value.quantity}
                              </strong>
                            </td>
                            <td className="cart-product-total">
                              <span className="amount">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "decimal",
                                  decimal: "VND",
                                }).format(
                                  parseInt(value.price) *
                                    parseInt(value.quantity)
                                ) + " VNĐ"}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    <tfoot>
                      <tr className="cart-subtotal">
                        <th>Shipping Cost</th>
                        <td>
                          <span className="amount">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "decimal",
                              decimal: "VND",
                            }).format(price) + " VNĐ"}
                          </span>
                        </td>
                      </tr>
                      <tr className="order-total">
                        <th>Order Total</th>
                        <td>
                          <strong>
                            <span className="amount">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "decimal",
                                decimal: "VND",
                              }).format(
                                parseInt(total_price) + parseInt(price)
                              ) + " VNĐ"}
                            </span>
                          </strong>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="payment-method">
                  <div className="payment-accordion"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
