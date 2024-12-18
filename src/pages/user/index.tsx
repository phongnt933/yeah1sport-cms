import React, { useState } from "react";
import AppTable from "../../components/AppTable";
import { IUser } from "../../@types/entities/User";
import { deleteUser, getAllUser } from "../../apis/user";
import usePagination from "../../hooks/usePagination";
import { RDGetAllUser } from "../../@types/apis/RequestData";
import { PAGE_SIZE } from "../../configs";
import { omitIsNil } from "../../utils/omit";
import { Button, Flex, TableProps } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { ROLE } from "../../constants/role";
import { useAppSelector } from "../../redux";
import CreateAccount from "./CreateAccount";

function UserPage() {
  const useInfo = useAppSelector((s) => s.auth.storage);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const apiConfig = (query: RDGetAllUser["query"], name?: string) => {
    return getAllUser({
      name,
      query: {
        ...omitIsNil({ ...query }, { deep: false }),
        record: PAGE_SIZE,
      },
    });
  };

  const {
    data: tableData,
    currentPage,
    total,
    onPaginationChange,
    isLoading,
    reloadData,
  } = usePagination<IUser, RDGetAllUser["query"]>([], apiConfig);

  const handleDelete = (id: string) => async () => {
    await deleteUser({
      param: { id },
      successHandler: {
        callBack(data) {
          toast.success("Xoá thành công");
        },
      },
      errorHandler: {
        callBack(error) {
          toast.error("Xoá thất bại");
        },
      },
    });
    reloadData();
  };

  const columns: TableProps<IUser>["columns"] = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (value, record, index) =>
        (currentPage - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "",
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        if (role === ROLE.ADMIN) {
          return "Quản trị";
        }
        if (role === ROLE.CUSTOMER) {
          return "Khách hàng";
        }
        if (role === ROLE.FIELD_OWNER) {
          return "Chủ sân";
        }
        if (role === ROLE.REFEREE) {
          return "Trọng tài";
        }
        return "Không xác định";
      },
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          disabled={record.id === useInfo?.userId}
          danger
          icon={<DeleteOutlined />}
          onClick={handleDelete(record.id)}
        />
      ),
    },
  ];

  const handleOpenCreateAccount = () => {
    setIsOpen(true);
  };

  const handleCloseCreateAccount = () => {
    setIsOpen(false);
  };

  return (
    <Flex vertical gap={16} style={{ padding: "16px 0" }}>
      <Flex justify="flex-end">
        <Button type="primary" onClick={handleOpenCreateAccount}>
          Tạo tài khoản
        </Button>
      </Flex>
      <AppTable<IUser>
        loading={isLoading}
        columns={columns}
        pagination={{
          total,
          pageSize: PAGE_SIZE,
          current: currentPage,
          onChange: onPaginationChange,
        }}
        dataSource={tableData}
      />
      <CreateAccount
        open={isOpen}
        onClose={handleCloseCreateAccount}
        reload={reloadData}
      />
    </Flex>
  );
}

export default UserPage;
