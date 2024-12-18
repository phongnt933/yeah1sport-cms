import React from "react";
import { Flex, Table } from "antd";
import type { TableColumnsType, TablePaginationConfig } from "antd";

interface IAppTableProps<T> {
  loading?: boolean;
  columns: TableColumnsType<T>;
  dataSource: T[];
  pagination: TablePaginationConfig;
}

function AppTable<T>(props: IAppTableProps<T>) {
  const { loading, dataSource, columns, pagination } = props;

  return (
    <Flex gap="middle" vertical style={{ width: "100%" }}>
      <Table<T>
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
      />
    </Flex>
  );
}

export default AppTable;
