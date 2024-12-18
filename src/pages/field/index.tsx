import React, { useState } from "react";
import { RDGetAllField } from "../../@types/apis/RequestData";
import usePagination from "../../hooks/usePagination";
import { Button, Flex, TableProps } from "antd";
import { PAGE_SIZE } from "../../configs";
import { omitIsNil } from "../../utils/omit";
import { EditOutlined } from "@ant-design/icons";
import AppTable from "../../components/AppTable";
import { getAllField } from "../../apis/field";
import { IField } from "../../@types/entities/Field";
import CreateFieldForm from "./CreateFieldForm";
import { d3Splitting } from "../../utils/number";
import { useAppSelector } from "../../redux";
import { ROLE } from "../../constants/role";

function FieldPage() {
  const userInfo = useAppSelector((s) => s.auth.storage);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const apiConfig = (query: RDGetAllField["query"], name?: string) => {
    return getAllField({
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
  } = usePagination<IField, RDGetAllField["query"]>([], apiConfig);

  const handleRedirectToField = (id: string) => () => {};

  // const handleDeleteField = (fieldId: string) => async () => {
  //   await deleteField({
  //     param: { fieldId },
  //     successHandler: {
  //       callBack(data) {
  //         toast.success("Xoá thành công");
  //       },
  //     },
  //     errorHandler: {
  //       callBack(error) {
  //         toast.error("Xoá thất bại");
  //       },
  //     },
  //   });
  //   reloadData();
  // };

  const handleOpenField = () => {
    setIsOpen(true);
  };

  const handleCloseField = () => {
    setIsOpen(false);
  };

  const columns: TableProps<IField>["columns"] = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (index) => (currentPage - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: "Tên sân",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Môn thể thao",
      dataIndex: "type",
      key: "type",
      render: (type) => type,
    },
    {
      title: "Chủ sân",
      dataIndex: "owner",
      key: "owner",
      render: (owner) => owner.name,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${d3Splitting(price)} VNĐ`,
    },
    {
      title: "Số lượng người",
      dataIndex: "capacity",
      key: "capacity",
      render: (capacity) => capacity,
    },
    {
      title: "Vị trí",
      dataIndex: "location",
      key: "location",
      render: (_, data) =>
        `${data.specificAddress},${data.ward},${data.district},${data.province}`,
    },
    {
      title: "Dụng cụ",
      dataIndex: "equipments",
      key: "equipments",
      render: (equipments) => (
        <div>
          {equipments.map((equipment: any, index: number) => (
            <div key={index}>
              {equipment.name} - {d3Splitting(equipment.price)} VNĐ
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",

      render: (_, data) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={handleRedirectToField(data.id)}
        />
      ),
    },
  ];

  return (
    <Flex style={{ padding: "16px 0" }} vertical gap={16}>
      <Flex justify="flex-end">
        {userInfo?.role === ROLE.FIELD_OWNER && (
          <Button type="primary" onClick={handleOpenField}>
            Thêm sân
          </Button>
        )}
      </Flex>
      <AppTable<IField>
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
      {isOpen && (
        <CreateFieldForm
          open={isOpen}
          reload={reloadData}
          onClose={handleCloseField}
        />
      )}
    </Flex>
  );
}

export default FieldPage;
