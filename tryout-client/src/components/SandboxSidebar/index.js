import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  AreaChartOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const SandboxSidebar = (props) => {
  const [collapsed, toggleCollapse] = useState(true);
  return (
    <Sider
      style={{
        background: "#F0F2F5",
      }}
      theme="light"
      collapsible
      onCollapse={() => toggleCollapse(!collapsed)}
      collapsed={collapsed}
    >
      <div
        style={{
          height: "32px",
          background: "#FFF",
          margin: "16px",
        }}
      />
      <Menu mode="inline">
        <Menu.Item
          style={{
            background: "#F0F2F5",
            margin: 0,
          }}
          key="1"
          icon={<HomeOutlined />}
        >
          Home
        </Menu.Item>
        <Menu.Item
          style={{
            background: "#F0F2F5",
            margin: 0,
          }}
          key="2"
          icon={<AreaChartOutlined />}
        >
          Tryout Statistics
        </Menu.Item>
        <Menu.Item
          style={{
            background: "#F0F2F5",
            margin: 0,
          }}
          key="3"
          icon={<HistoryOutlined />}
        >
          Diff View
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SandboxSidebar;
