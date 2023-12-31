import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Image from '../../Image/Global';

Products.propTypes = {
    products: PropTypes.array,
    sort: PropTypes.string
};

Products.defaultProps = {
    products: [],
    sort: ''
}

function Products(props) {

    const { products, sort } = props

    if (sort === 'DownToUp') {
        products.sort((a, b) => {
            return a.price_product - b.price_product
        });
    }
    else if (sort === 'UpToDown') {
        products.sort((a, b) => {
            return b.price_product - a.price_product
        });
    }

    return (
        <div className="row">
            {
                products && products.map(value => (
                    <div className="col-lg-4 col-md-4 col-sm-6 mt-40 animate__animated animate__zoomIn col_product" key={value._id}>
                        <div className="single-product-wrap">
                            <div className="product-image">
                                <Link to={`/detail/${value.id}`}>
                                    <img src={Image.BACKGROUND1} alt="Li's Product Image" />
                                </Link>
                            </div>
                            <div className="product_desc">
                                <div className="product_desc_info">
                                    <h4><a className="product_name" href={`/detail/${value.id}`}>{value.name}</a></h4>
                                    <div className="price-box">
                                        <span className="new-price">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(value.price)+ ' VNĐ'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default Products;