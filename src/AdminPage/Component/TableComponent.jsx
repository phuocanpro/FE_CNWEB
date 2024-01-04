import { Table } from "antd";
import React, { useMemo, useState } from "react";
import { Excel } from "antd-table-saveas-excel";
const TableComponent = (props) => {
  const {
    handleDeleteMany,
    selectionType = "checkbox",
    data = [],
    columns = [],
  } = props;

  const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
  const newColumnExport = useMemo(() => {
    const filter = columns?.filter((col) => col.dataIndex != "action");
    return filter;
  }, [columns]);

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys);
    },
  };
  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKeys);
  };

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(data, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };
  return (
    <>
      {rowSelectedKeys.length > 0 && (
        <div
          style={{
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Delete All
        </div>
      )}
      <button
        style={{
          background: "red",
          color: "yellow",
          fontSize: "16px",
          borderRadius: "8px",
          padding: "10px 20px",
        }}
        onClick={exportExcel}
      >
        Export Excel
      </button>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </>
  );
};

export default TableComponent;
