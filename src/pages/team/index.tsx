import React from "react";
import { getAllTeam } from "../../apis/team";
import { RDGetAllTeam } from "../../@types/apis/RequestData";
import { omitIsNil } from "../../utils/omit";
import { PAGE_SIZE } from "../../configs";
import usePagination from "../../hooks/usePagination";
import { Button, Flex, TableProps } from "antd";
import { ITeam } from "../../@types/entities/Team";
import AppTable from "../../components/AppTable";
import { EyeOutlined } from "@ant-design/icons";

function TeamPage() {
  const apiConfig = (query: RDGetAllTeam["query"], name?: string) => {
    return getAllTeam({
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
  } = usePagination<ITeam, RDGetAllTeam["query"]>([], apiConfig);

  const columns: TableProps<ITeam>["columns"] = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      render: (value, record, index) =>
        (currentPage - 1) * PAGE_SIZE + index + 1,
    },
    {
      title: "Tên sân",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "Môn thể thao",
      dataIndex: "sport",
      key: "sport",
      render: (sport) => sport,
    },
    {
      title: "Số lượng",
      dataIndex: "members",
      key: "members",
      render: (members) => members.length,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description) => description,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (description) => description,
    },
    {
      title: "Hành động",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => <Button type="primary" icon={<EyeOutlined />} />,
    },
  ];
  return (
    <Flex style={{ padding: "16px 0" }} vertical gap={16}>
      <AppTable<ITeam>
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
    </Flex>
  );
}
export default TeamPage;
