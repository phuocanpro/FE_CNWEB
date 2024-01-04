import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import Product from "../API/Dishes";
import { Link, useParams } from "react-router-dom";
import Products from "./Component/Products";
import Pagination from "./Component/Pagination";
import Search from "./Component/Search";

Shop.propTypes = {};

function Shop(props) {
  const { id } = useParams();

  const [products, setProducts] = useState([]);

  //Tổng số trang
  const [totalPage, setTotalPage] = useState();

  //Từng trang hiện tại
  const [pagination, setPagination] = useState({
    page: "1",
    count: "6",
    search: "",
    category: id,
  });

  //Hàm này dùng để thay đổi state pagination.page
  //Nó sẽ truyền xuống Component con và nhận dữ liệu từ Component con truyền lên
  const handlerChangePage = (value) => {
    console.log("Value: ", value);

    //Sau đó set lại cái pagination để gọi chạy làm useEffect gọi lại API pagination
    setPagination({
      page: value,
      count: pagination.count,
      search: pagination.search,
      category: pagination.category,
    });
  };

  //Gọi hàm để load ra sản phẩm theo pagination dữ vào id params
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: pagination.page,
        count: pagination.count,
        search: pagination.search,
        category: id,
      };

      const query = "?" + queryString.stringify(params);

      const response = await Product.Get_All_Product(query);
      console.log(response);

      setProducts(response);
    };

    fetchData();
  }, [id]);

  //Gọi hàm để load ra sản phẩm theo pagination dữ vào id params
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: pagination.page,
        count: pagination.count,
        search: pagination.search,
        category: id,
      };

      const query = "?" + queryString.stringify(params);

      const response = await Product.Get_Pagination(query);
      console.log(response);

      setProducts(response);
    };

    fetchData();
  }, [pagination]);

  const handler_Search = (value) => {
    console.log("Search: ", value);

    setPagination({
      page: pagination.page,
      count: pagination.count,
      search: value,
      category: pagination.category,
    });
  };

  return (
    <div>
      <div className="breadcrumb-area">
        <div className="container">
          <div className="breadcrumb-content">
            <ul>
              <li>
                <a href="index.html">Home</a>
              </li>
              <li className="active">Shop</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="li-main-blog-page li-main-blog-details-page pt-60 pb-60 pb-sm-45 pb-xs-45">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 order-lg-1 order-2">
              <div className="li-blog-sidebar-wrapper">
                <div className="li-blog-sidebar pt-25">
                  <h4 className="li-blog-sidebar-title">All Product</h4>
                  <ul className="li-blog-archive">
                    <li>
                      <Link
                        to="/shop/all"
                        style={
                          id === "all"
                            ? { cursor: "pointer", color: "#fed700" }
                            : { cursor: "pointer" }
                        }
                      >
                        All
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-9 order-1 order-lg-2">
              <div className="shop-products-wrapper">
                <div className="tab-content">
                  <div
                    id="grid-view"
                    className="tab-pane active"
                    role="tabpanel"
                  >
                    <div className="product-area shop-product-area">
                      <Products products={products} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop;
