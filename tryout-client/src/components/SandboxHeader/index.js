import React from "react";
import { Row, Col, Input, Button, Dropdown, Menu } from "antd";
import {
  CodeOutlined,
  PlayCircleOutlined,
  RetweetOutlined,
  SettingOutlined,
  DownOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import styles from "./styles.module.css";

const SandboxHeader = (props) => {
  const formatLanguageName = () => {
    return props.language
      .replace("_", " ")
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(" ");
  };
  const renderButtonGroup = () => {
    return [
      {
        icon: <SettingOutlined />,
        func: () => {},
      },
      {
        icon: <RetweetOutlined />,
        func: props.clear,
      },
      {
        icon: props.loading ? <SyncOutlined spin /> : <PlayCircleOutlined />,
        func: props.compile,
      },
    ].map((button, index) => (
      <Button
        onClick={() => {
          button.func();
        }}
        key={index}
        style={{
          float: "right",
          margin: "0 10px",
        }}
        shape="round"
        icon={button.icon}
        size="large"
      ></Button>
    ));
  };
  const renderLanguagesDropdown = () => {
    return (
      <Menu
        onClick={(item) => {
          props.onLanguageChange(item.key);
        }}
      >
        <Menu.Item key="javascript">Javascript</Menu.Item>
        <Menu.Item key="python">Python</Menu.Item>
        <Menu.Item key="java">Java</Menu.Item>
        <Menu.Item key="c">C</Menu.Item>
      </Menu>
    );
  };
  return (
    <Row id={styles.wrapper}>
      <Col span={6}>
        <Input
          size="large"
          placeholder="Tryout Name"
          prefix={<CodeOutlined />}
        />
      </Col>
      <Col span={18}>
        <Dropdown overlay={renderLanguagesDropdown()}>
          <Button
            size="large"
            style={{
              float: "right",
            }}
          >
            {formatLanguageName()} <DownOutlined />
          </Button>
        </Dropdown>
        {renderButtonGroup()}
      </Col>
    </Row>
  );
};

export default SandboxHeader;
