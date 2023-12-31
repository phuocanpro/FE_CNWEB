import React, { useEffect, useState } from "react";
import { getItem } from "./utils.js";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import AdminDish from "./Component/AdminDish";
import AdminUser from "./Component/AdminUser";
import { AdminHome } from "./Component/AdminHome.jsx";
import User from "../API/User.jsx";
import { useHistory } from "react-router-dom";
const AdminPage = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = sessionStorage.getItem("id_user");
        if (userId) {
          const userData = await User.Get_User(userId);
          setUser(userData);
        } else {
          // Chuyển hướng nếu không có userId
          history.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [history]);

  useEffect(() => {
    if (user && user.role !== "admin") {
      // Nếu vai trò không phải là admin, chuyển hướng đến trang khác
      history.push("/");
    }
  }, [user, history]);

  const MENU_ITEMS = [
    getItem("Home", "homes", <SettingOutlined />),
    getItem("User", "users", <UserOutlined />),
    getItem("Dish", "dishs", <AppstoreOutlined />),
  ];

  const [selectedPage, setSelectedPage] = useState("");

  const renderPage = (key) => {
    switch (key) {
      case "homes":
        return <AdminHome />;
      case "users":
        return <AdminUser />;
      case "dishs":
        return <AdminDish />;
      default:
        return null;
    }
  };

  const handleOnClick = ({ key }) => {
    setSelectedPage(key);
  };

  return (
    <div style={{ display: "flex" }}>
   
      <Menu
        mode="inline"
        style={{
          width: "250px",
          boxShadow: "1px 1px 2px #ccc",
          height: "100vh",
        }}
        onClick={handleOnClick}
      >
        {MENU_ITEMS.map(({ key, label, icon }) => (
          <Menu.Item key={key} icon={icon}>
            {label}
          </Menu.Item>
        ))}
      </Menu>
      <div style={{ flex: 4 }}>
        <div style={{ flex: 1, padding: "20px" }}>
          {renderPage(selectedPage)}
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
