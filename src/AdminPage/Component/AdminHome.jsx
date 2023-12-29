import React, { useEffect, useState } from 'react'
import FeaturedInfo from './featuredInfo/FeaturedInfo';
import Chart from './chart/Chart';

export const AdminHome = () => {
    let date = new Date().toJSON().slice(0, 10);
  const [chart, setChart] = useState([]);
  useEffect(() => {
    // Giả sử rằng chúng ta có một số dữ liệu giả
    const fakeData = [
      { MONTH: 1, TOTAL_COST: 100 },
      { MONTH: 2, TOTAL_COST: 200 },
      { MONTH: 3, TOTAL_COST: 300 },
      { MONTH: 5, TOTAL_COST: 200 },
      { MONTH: 7, TOTAL_COST: 300 },
      { MONTH: 11, TOTAL_COST: 100 },
      { MONTH: 12, TOTAL_COST: 300 },
    ];
    setChart(fakeData);
  }, []);
  const chartData = [
    { name: "Jan", Sales: 0 },
    { name: "Feb", Sales: 0 },
    { name: "Mar", Sales: 0 },
    { name: "Apr", Sales: 0 },
    { name: "May", Sales: 0 },
    { name: "Jun", Sales: 0 },
    { name: "Jul", Sales: 0 },
    { name: "Aug", Sales: 0 },
    { name: "Sep", Sales: 0 },
    { name: "Oct", Sales: 0 },
    { name: "Nov", Sales: 0 },
    { name: "Dec", Sales: 0 },
  ];
  for (let index = 0; index < chartData.length; index++) {
    for (let i = 0; i < chart.length; i++) {
      if (chart[i]["MONTH"] === index + 1) {
        chartData[index]["Sales"] = chart[i]["TOTAL_COST"];
      }
    }
  }

  return (
    <div style={{ flex: 4 }}>
        <FeaturedInfo />
        <Chart data={chartData} title="User Analytics" grid dataKey="Sales" />
      </div>
  )
}
