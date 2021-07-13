import React, { useState } from "react";
import styles from "./styles.module.css";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  AreaChartOutlined,
  HistoryOutlined,
  FileAddOutlined,
  createFromIconfontCN,
} from "@ant-design/icons";

const CustomIcon = createFromIconfontCN({
  scriptUrl: ["//at.alicdn.com/t/font_2638979_hdz1obnq2rj.js"],
});

const { Sider } = Layout;

const SandboxSidebar = (props) => {
  const [collapsed, toggleCollapse] = useState(true);

  const renderFileNavigator = () => {
    return (
      <Menu
        mode="inline"
        style={{
          background: "#333140",
          height: "100%",
        }}
      >
        {props.files.map((file, idx) => {
          return (
            <Menu.Item
              className={styles.fileMenuItem}
              key={idx}
              icon={<CustomIcon type="icon-txt" />}
            >
              {file.name}
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  return (
    <Sider
      style={{
        background: "#F0F2F5",
        height: "100%",
        zIndex: 5,
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
          Statistics
        </Menu.Item>
        <Menu.Item
          style={{
            background: "#F0F2F5",
            margin: 0,
          }}
          key="3"
          icon={<HistoryOutlined />}
        >
          Events
        </Menu.Item>
        <Menu.Item
          style={{
            background: "#F0F2F5",
            margin: 0,
          }}
          key="4"
          icon={<FileAddOutlined />}
        >
          Create File
        </Menu.Item>
      </Menu>
      {/* {renderFileNavigator()} */}
    </Sider>
  );
};

export default SandboxSidebar;
