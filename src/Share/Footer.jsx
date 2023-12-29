import React from 'react';
import PropTypes from 'prop-types';
import Global from '../Image/Global'

Footer.propTypes = {

};

function Footer(props) {
    return (
        <div className="footer">
           
            <div className="footer-static-middle">
                <div className="container">
                    <div className="footer-logo-wrap pt-50 pb-35">
                        <div className="row">
                            <div className="col-lg-4 col-md-6">
                                <div className="footer-logo">
                                    <img src={Global.Logo} style={{ width: '200px'}} alt="Footer Logo" />
                                </div>
                                <ul className="des">
                                    <li>
                                        <span>Address: </span>
                                    426 Trần Đại Nghĩa, Hòa Quý, Ngũ Hành Sơn, Đà Nẵng
                                </li>
                                    <li>
                                        <span>Phone: </span>
                                        <a href="#">0826519466</a>
                                    </li>
                                    <li>
                                        <span>Email: </span>
                                        <a href="mailto://nglien000@gmail.com">nglien000@gmail.com.com</a>
                                    </li>
                                </ul>
                            </div>
                                <div className="col-lg-2 col-md-3 col-sm-6">
                                    <div className="footer-block">
                                        <h3 className="footer-block-title">Dishes</h3>
                                        <ul>
                                            <li><a href="#">Prices drop</a></li>
                                            <li><a href="#">New dishes</a></li>
                                            <li><a href="#">Best sales</a></li>
                                            <li><a href="#">Contact us</a></li>
                                        </ul>
                                    </div>
                                </div>
                            <div className="col-lg-2 col-md-3 col-sm-6">
                                <div className="footer-block">
                                    <h3 className="footer-block-title">Our company</h3>
                                        <ul>
                                            <li><a href="#">Delivery</a></li>
                                            <li><a href="#">Legal Notice</a></li>
                                            <li><a href="#">About us</a></li>
                                            <li><a href="#">Contact us</a></li>
                                      </ul>
                                </div>
                            </div>
                            <div className="col-lg-4">  
                                <div className="footer-newsletter">
                                    <h4>Sign up to newsletter</h4>
                                    <form action="#" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="footer-subscribe-form validate" target="_blank">
                                        <div id="mc_embed_signup_scroll">
                                            <div id="mc-form" className="mc-form subscribe-form form-group" >
                                                <input id="mc-email" type="email" autoComplete="off" placeholder="Enter your email" />
                                                <button className="btn" id="mc-submit">Subscribe</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;