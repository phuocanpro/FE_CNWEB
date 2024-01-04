import React, { useEffect, useRef, useState } from "react";
import { Button, Form, message } from "antd";
import TableComponent from "./TableComponent";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ModalComponent from "./ModalComponent";
import InputComponent from "./InputComponent";
import DrawerComponent from "./DrawerComponent";
import { WrapperHeader } from "./style";
import Order from "../../API/OrderAPI";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);

  const getAllOrders = async () => {
    const res = Order.GetAll();
    return res;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getAllOrders();
        setOrders(Array.from(ordersData?.orders));
      } catch (error) {
        // Handle error
        console.log("err", error);
      }
    };
    fetchData();
  }, []);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />

        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{
            width: 90,
          }}
        >
          Search
        </Button>
        <Button
          onClick={() => clearFilters && handleReset(clearFilters)}
          size="small"
          style={{
            width: 90,
          }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "UserName",
      dataIndex: "username",
      sorter: (a, b) => a.username.length - b.username.length,
      ...getColumnSearchProps("username"),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      ...getColumnSearchProps("address"),
    },
    {
      title: "Dishes",
      dataIndex: "dishes",
      sorter: (a, b) => a.dishes - b.dishes,
      ...getColumnSearchProps("dishes"),
      render: (dishes) => (
        <div>
          {Array.isArray(dishes) &&
            dishes.map((dish, index) => (
              <div key={index} style={{ marginBottom: "5px" }}>
                <p>
                  <strong>Dish Name:</strong> {dish.dish_name}
                </p>
                <p>
                  <strong>Dish Price:</strong> {dish.dish_price}
                </p>
                <p>
                  <strong>Quantity:</strong> {dish.quantity}
                </p>
                <p>
                  <strong>Payment Method:</strong> {dish.payment_method}
                </p>
              </div>
            ))}
        </div>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "total",
    },
  ];

  const dataTable = Array.isArray(orders)
    ? orders?.map((order) => {
        return {
          username: order?.user_name,
          phone: order?.phone_number,
          address: order?.address,
          dishes: order?.dishes,
          total: order?.total_price,
          key: order.id,
        };
      })
    : [];

  return (
    <div style={{ marginTop: "10px" }}>
      <WrapperHeader>Manager Users</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent columns={columns} data={dataTable} />
      </div>
    </div>
  );
};
export default AdminOrder;
