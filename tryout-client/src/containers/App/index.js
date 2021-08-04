import React from "react";
import styles from "./styles.module.css";
import { connect } from "react-redux";

import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import { Avatar, Layout, Menu, Row, Col } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CodeOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";

import Authenticate from "../Authenticate";
import Sandbox from "../Sandbox";

const { Header, Content, Footer } = Layout;

const INGORE_DEFAULT_LAYOUT = ["sandbox"];
const PAGES = {
  home: {
    title: "Home",
    icon: <HomeOutlined />,
    link: "/",
  },
  auth: {
    title: "Account",
    icon: <UserOutlined />,
    link: "/auth",
  },
  sandbox: {
    title: "Sandbox",
    icon: <CodeOutlined />,
    link: "/sandbox",
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activePage: this.getActivePath() || "home",
    };
  }

  getActivePath() {
    const { location } = this.props;
    const pathname = location.pathname;
    const activePage = pathname.split("/")[1];
    return activePage;
  }

  renderNavbar() {
    console.log("Active page: ", this.state.activePage);
    const menuItems = Object.entries(PAGES).map(([key, value]) => {
      return (
        <Menu.Item key={key}>
          <Link
            to={{
              pathname: value.link,
              state: { activePage: key },
            }}
          >
            {value.icon} {value.title}
          </Link>
        </Menu.Item>
      );
    });

    return (
      <Header>
        <Row justify="space-between">
          <Col>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[this.state.activePage]}
            >
              {menuItems}
            </Menu>
          </Col>
          <Col>
            <Avatar icon={<AntDesignOutlined />} />
          </Col>
        </Row>
      </Header>
    );
  }

  renderSiteLayout(children) {
    const basePath = this.getActivePath();
    if (INGORE_DEFAULT_LAYOUT.includes(basePath)) {
      return children;
    }
    return (
      <Layout id={styles.layout}>
        {this.renderNavbar()}
        <Content id={styles.content}>{children}</Content>
        <Footer style={{ textAlign: "center" }}>
          Tryout ©2021 Created by Matan Broner
        </Footer>
      </Layout>
    );
  }

  render() {
    const content = (
      <Switch>
        <Route exact path="/" render={() => <div>Home</div>} />
        <Route exact path="/auth" component={Authenticate} />
        <Route path="/sandbox" component={Sandbox} />
      </Switch>
    );
    return this.renderSiteLayout(content);
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
