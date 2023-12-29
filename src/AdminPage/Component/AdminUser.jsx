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
import User from "../../API/User";

const AdminUser = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  const [users, setUsers] = useState([]);
  const user = User.Get_User(sessionStorage.getItem("id_user"));
  console.log("user", user);

  const [stateUserDetails, setStateUserDetails] = useState({
    userName: "",
    email: "",
    password: "",
    isAdmin: "",
    phone: "",
    address: "",
  });

  const [form] = Form.useForm();

  const getAllUsers = async () => {
    const res = User.Get_All_User();
    return res;
  };

  useEffect(() => {
    console.log("useEffect is running");
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers();
        setUsers(Array.from(usersData));
      } catch (error) {
        // Handle error
        console.log("err", error);
      }
    };
    fetchData();
  }, []);

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      {
        id: rowSelected,
        ...stateUserDetails,
      }
      //   {
      //     onSettled: () => {
      //       queryUser.refetch();
      //     },
      //   }
    );
  };

  //   const mutationDelete = useMutationHooks(async (data) => {
  //     const { id, token } = data;
  //     const res = await UserService.deleteUser(id, token);
  //     return res;
  //   });

  const mutationUpdate = async (data) => {
    const { id, ...rests } = data;
    const res = await User.Put_User(id, { ...rests });
    return res;
  };

  //   const mutationDeleteMany = useMutationHooks(async (data) => {
  //     const { token, ...ids } = data;
  //     const res = await UserService.deleteManyUser(ids, token);
  //     return res;
  //   });
  //   const handleDeleteManyUsers = (ids) => {
  //     mutationDeleteMany.mutate(
  //       { ids: ids, token: user?.access_token },
  //       {
  //         onSettled: () => {
  //           queryUser.refetch();
  //         },
  //       }
  //     );
  //   };
  //   const {
  //     data: dataDeleted,
  //     isLoading: isLoadingDeleted,
  //     isSuccess: isSuccessDeleted,
  //     isError: isErrorDeleted,
  //   } = mutationDelete;

  //   const {
  //     data: dataDeletedMany,
  //     isLoading: isLoadingDeletedMany,
  //     isSuccess: isSuccessDeletedMany,
  //     isError: isErrorDeletedMany,
  //   } = mutationDeleteMany;

  const {
    data: dataUpdated,
    isLoading: isLoadingUpdated,
    isSuccess: isSuccessUpdated,
isError: isErrorUpdated,
  } = mutationUpdate;

  const [userDetails, setUserDetails] = useState({});
  const fetchGetDetailsUser = async () => {
    const data = User.Get_User(rowSelected);
    setUserDetails(data);
    setStateUserDetails({
      userName: userDetails?.name,
      email: userDetails?.email,
      password: userDetails?.password,
      isAdmin: userDetails?.role,
      phone: userDetails?.phone,
      address: userDetails?.address,
    });
    console.log("stateUserDetails", userDetails?.name);
    // setIsLoadingUpdate(false);
  };
  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      //   setIsLoadingUpdate(true);
      fetchGetDetailsUser(rowSelected);
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
          onClick={handleDetailsUsers}
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email - b.email,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      filters: [
        {
          text: "True",
          value: true,
        },
        {
          text: "False",
          value: false,
        },
      ],
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
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];
  const dataTable = Array.isArray(users)
    ? users?.map((user) => {
        return {
          ...user,
          userName: user.name,
          key: user.id,
          isAdmin: user.role === "admin" ? "TRUE" : "FALSE",
        };
      })
    : [];

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      userName: "",
      email: "",
      password: "",
      isAdmin: "",
      phone: "",
      address: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success();
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error();
    }
  }, [isSuccessUpdated, isErrorUpdated]);

  //   useEffect(() => {
  //     if (isSuccessDeleted && dataDeleted?.status === "OK") {
  //       message.success();
  //       handleCancelDelete();
  //     } else if (isErrorDeleted) {
  //       message.error();
  //     }
  //   }, [isSuccessDeleted, isErrorDeleted]);

  //   useEffect(() => {
  //     if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
  //       message.success();
  //     } else if (isErrorDeletedMany) {
  //       message.error();
  //     }
  //   }, [isSuccessDeletedMany, isErrorDeletedMany]);
  const handleDetailsUsers = () => {
    setIsOpenDrawer(true);
  };
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  //   const handleDeleteUser = () => {
  //     mutationDelete.mutate(
  //       { id: rowSelected, token: user?.access_token },
  //       {
  //         onSettled: () => {
  //           queryUser.refetch();
  //         },
  //       }
  //     );
  //   };

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div style={{ marginTop: "10px" }}>
<WrapperHeader>Manager Users</WrapperHeader>
      <div style={{ marginTop: "20px" }}>
        <TableComponent
          //   handleDeleteMany={handleDeleteManyUsers}
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
      <DrawerComponent
        title="Details User"
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
          onFinish={onUpdateUser}
          autoComplete="on"
          form={form}
        >
          <Form.Item
            label="UserName"
            name="userName"
            rules={[{ required: true, message: "Please input userName!" }]}
          >
            <InputComponent
              value={stateUserDetails.userName}
              onChange={handleOnchangeDetails}
              name="userName"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <InputComponent
              value={stateUserDetails.email}
              onChange={handleOnchangeDetails}
              name="email"
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input password!" }]}
          >
            <InputComponent
              value={stateUserDetails.password}
              onChange={handleOnchangeDetails}
              name="password"
            />
          </Form.Item>
          <Form.Item
            label="Admin"
            name="isAdmin"
            rules={[{ required: true, message: "Please input isAdmin!" }]}
          >
            <InputComponent
              value={stateUserDetails.isAdmin}
              onChange={handleOnchangeDetails}
              name="isAdmin"
            />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please input phone!" }]}
          >
            <InputComponent
              value={stateUserDetails.phone}
              onChange={handleOnchangeDetails}
              name="phone"
            />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please input address!" }]}
          >
            <InputComponent
              value={stateUserDetails.address}
              onChange={handleOnchangeDetails}
              name="address"
            />
          </Form.Item>

          <Form.Item
label="Avatar"
            name="avatar"
            rules={[{ required: true, message: "Please input avatar!" }]}
          ></Form.Item>
          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </DrawerComponent>
      <ModalComponent
        title="Delete User"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        // onOk={handleDeleteUser}
      >
        <div>Are you sure delete this user?</div>
      </ModalComponent>
    </div>
  );
};
export default AdminUser;