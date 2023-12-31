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
import { WrapperHeader, WrapperUploadFile } from "./style";
import { getBase64 } from "../utils";
import Product from "../../API/Product";

const AdminDish = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [dishDetails, setDishDetails] = useState({});
  const [stateDish, setStateDish] = useState({
    dishName: "",
    description: "",
    price: "",
    img: "",
  });
  const [stateDishDetails, setStateDishDetails] = useState({
    dishName: "",
    description: "",
    price: "",
    img: "",
  });

  const [form] = Form.useForm();

  const onUpdateDish = async () => {
    const res = await Product.Put_Dish(stateDishDetails);
    if (res.status === "SUCCESS") {
      message.success("Success");
      handleCloseDrawer();
    } else {
      message.error("Error");
    }
  };

  const getAllDishes = async () => {
    const res = Product.Get_All_Product();
    return res;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dishesData = await getAllDishes();
        setDishes(Array.from(dishesData));
      } catch (error) {
        // Handle error
        console.log("err", error);
      }
    };
    fetchData();
  }, []);

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateDish({
      dishName: "",
      description: "",
      price: "",
      img: "",
    });
    form.resetFields();
  };
  const fetchGetDetailsDish = async (rowSelected) => {
    const data = Product.Get_Detail_Product(rowSelected);
    setDishDetails(data);
    setStateDishDetails({
      dishName: dishDetails?.name,
      description: dishDetails?.description,
      price: dishDetails?.price,
      img: dishDetails?.img,
    });
    console.log("data", data);
   
  };
  useEffect(() => {
    form.setFieldsValue(stateDishDetails);
  }, [form, stateDishDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      //   setIsLoadingUpdate(true);
      fetchGetDetailsDish(rowSelected);
    }
    // setIsOpenDrawer(true);
  }, [rowSelected, isOpenDrawer]);

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          onClick={handleDetailsDishes}
        />
      </div>
    );
  };

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
 
  const onFinish = () => {
    const params = {
      dishName: stateDish.dishName,
      description: stateDish.description,
      price: stateDish.price,
      img: stateDish.img,
    };
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description - b.description,
      ...getColumnSearchProps("description"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      ...getColumnSearchProps("price"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable = Array.isArray(dishes)
  ? dishes?.map((dish) => {
      return {
        ...dish,
        key: dish.id,
      };
    })
  : [];
    

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateDishDetails({
      dishName: "",
      description: "",
      price: "",
      img: "",
    });
    form.resetFields();
  };

  const handleOnchange = (e) => {
    setStateDish({
      ...stateDish,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleDetailsDishes = () => {
    setIsOpenDrawer(true);
  };
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const handleDeleteDish = async () => {
    const res = await Product.Delete(String(rowSelected));
    if (res.status === "success") {
      handleCancelDelete();
      message.success("Success");
      const updatedDishes = await getAllDishes();
      setDishes(Array.from(updatedDishes));
    } else {
      message.error("Error");
    }
  };
  

  const handleOnchangeDetails = (e) => {
    setStateDishDetails({
      ...stateDishDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnchangeAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    console.log("file", file.preview);
    setStateDishDetails({
      ...stateDishDetails,
      img: file.preview,
    });
  };
  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    console.log("file", file.preview);
    setStateDish({
      ...stateDish,
      img: file.preview,
    });
  };
  return (
    <div style={{ marginTop: "10px" }}>
<WrapperHeader>Manager Dishes</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          columns={columns}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record.id);
              },
            };
          }}
        />
      </div>
      <ModalComponent
        forceRender
        title="Add New Dish"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {" "}
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="DishName"
            name="dishName"
            rules={[{ required: true, message: "Please input name dish!" }]}
          >
            <InputComponent
              value={stateDish.name}
              onChange={handleOnchange}
              name="name"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description dish!" }]}
          >
            <InputComponent
                value={stateDish.description}
                onChange={handleOnchange}
                name="description"
              />

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input price dish!" }]}
          >
            <InputComponent
              value={stateDish.price}
              onChange={handleOnchange}
              name="price"
            />
          </Form.Item>
          <Form.Item
            label="Img"
            name="img"
            rules={[{ required: true, message: "Please input image!" }]}
          >
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button type="button">Select File</Button>
              {stateDish?.img && (
                <img
                  src={stateDish?.img}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="dish"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          </Form.Item>
        </Form>
      </ModalComponent>

      <DrawerComponent
        title="Details Dish"
        isOpen={isOpenDrawer}
        onClose={() => setIsOpenDrawer(false)}
        width="90%"
      >
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onUpdateDish}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="DishName"
            name="dishName"
            rules={[{ required: true, message: "Please input dishName!" }]}
          >
            <InputComponent
              value={stateDishDetails.dishName}
              onChange={handleOnchangeDetails}
              name="dishName"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <InputComponent
              value={stateDishDetails.description}
              onChange={handleOnchangeDetails}
              name="description"
            />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <InputComponent
              value={stateDishDetails.price}
              onChange={handleOnchangeDetails}
              name="price"
            />
          </Form.Item>
        

          <Form.Item
            label="Img"
            name="img"
            rules={[{ required: false, message: "Please input image!" }]}
          >
            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
              <Button type="button">Select File</Button>
              {stateDishDetails?.img && (
                <img
                  src={stateDishDetails?.img}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="dish"
                />
              )}
            </WrapperUploadFile>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
      <ModalComponent
        title="Delete Dish"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteDish}
      >
        <div>Are you sure delete this dish?</div>
      </ModalComponent>
    </div>
  );
};
export default AdminDish;