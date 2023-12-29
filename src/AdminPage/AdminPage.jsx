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


const AdminPage = () => {
  
  const MENU_ITEMS = [
    getItem("Home", "homes", <SettingOutlined/>),
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