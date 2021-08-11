import React from "react";
import styles from "./styles.module.css";
import { connect } from "react-redux";
import qs from "query-string";

import { Form, Input, Button, Checkbox, Card, Row, Col } from "antd";

import { register } from "../../actions/user";
import { emailIsValid } from "../../util";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class Authenticate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: {
        email: "",
        password: "",
        remember: false,
      },
      isRegisterForm: false,
    };
  }
  componentDidMount() {
    this.queryRedirect();
  }

  queryRedirect(newQuery = null) {
    if (newQuery) {
      this.props.history.push(`/auth${newQuery}`);
    }
    const { search } = this.props.location;
    const url = newQuery || search;
    if (url) {
      const parsed = qs.parse(url);
      // query param is "type"
      if (parsed.type === "register") {
        this.setState({ isRegisterForm: true });
      } else if (parsed.type === "login") {
        this.setState({ isRegisterForm: false });
      }
    } else {
      // If there is no query, default to login
      this.props.history.push(`/auth?type=login`);
    }
  }

  submitRegister = (formValues) => {
    this.props.register(formValues);
  };

  renderLoginForm() {
    return (
      <Form
        {...layout}
        name="loginForm"
        initialValues={{
          remember: true,
        }}
        wrapperCol={{ span: 16 }}
        size="large"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: "Email is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name="remember" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
          <p className={styles.formToggle}>
            Or register a{" "}
            <a
              onClick={(e) => {
                e.preventDefault();
                this.queryRedirect("?type=register");
              }}
            >
              new account
            </a>
          </p>
        </Form.Item>
      </Form>
    );
  }

  renderRegisterForm() {
    return (
      <Form
        {...layout}
        name="loginForm"
        initialValues={{
          remember: true,
        }}
        wrapperCol={{ span: 16 }}
        size="large"
        onFinish={this.submitRegister}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          hasFeedback
          rules={[{ required: true, message: "First Name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          hasFeedback
          rules={[{ required: true, message: "Last Name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          hasFeedback
          rules={[
            { required: true, message: "Email is required" },
            () => ({
              validator(_, value) {
                if (emailIsValid(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Email format is invalid")
                );
              },
            }),
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          hasFeedback
          rules={[
            { required: true, message: "Password is required" },
            () => ({
              validator(_, value) {
                if (value.length >= 8) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Password must be 8 characters or longer")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
          <p className={styles.formToggle}>
            Or login to an{" "}
            <a
              onClick={(e) => {
                e.preventDefault();
                this.queryRedirect("?type=login");
              }}
            >
              existing account
            </a>
          </p>
        </Form.Item>
      </Form>
    );
  }

  render() {
    return (
      <Row id={styles.contentRow}>
        <Col span={12} offset={6} id={styles.contentColCenter}>
          <Card
            size="large"
            id={styles.card}
            title={this.state.isRegisterForm ? "Register" : "Login to Tryout"}
          >
            {this.state.isRegisterForm
              ? this.renderRegisterForm()
              : this.renderLoginForm()}
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (payload) => dispatch(register(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);
