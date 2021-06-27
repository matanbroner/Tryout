import React from "react";
import MonacoEditor from "react-monaco-editor";

import socketIOClient from "socket.io-client";

import { Row, Col, Layout, Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import SandboxSidebar from "../../components/SandboxSidebar";
import SandboxHeader from "../../components/SandboxHeader";
import SandboxOutput from "../../components/SandboxOutput";
import starterCode from "../../assets/starterCode";
import styles from "./styles.module.css";

const superagent = require("superagent");

const { Content } = Layout;

const socketIoServerEndpoint = "http://127.0.0.1:5700";

class Sandbox extends React.Component {
  constructor(props) {
    super();
    this.initialLanguage = "python";
    this.state = {
      loading: false,
      editor: {
        rawContent: starterCode[this.initialLanguage],
        language: this.initialLanguage,
        theme: "vs-dark",
      },
      output: {
        stdout: "",
        stderr: "",
      },
      modals: {
        clearEditor: false,
      },
    };
  }

  // catch browser tab close event
  setupBeforeUnloadListener = () => {
    window.addEventListener(
      "beforeunload",
      function (ev) {
        ev.preventDefault();
        return this.killSocketConnection();
      }.bind(this)
    );
  };

  setupSocketConnection() {
    const socket = socketIOClient(socketIoServerEndpoint);
    socket.on("connect", function () {
      console.log("Connected to backend server");
    });
    socket.on("disconnect", function () {
      console.log("Disconnecting from backend server");
    });
    socket.on(
      "compile_complete",
      function (data) {
        console.log("Got compile complete");
        console.log(data);
        this.setState({
          loading: false,
          output: {
            stdout: data.stdout,
            stderr: data.stderr,
          },
        });
      }.bind(this)
    );
    socket.emit("join_room", {
      roomId: "1234",
      userId: "matanbroner",
    });
    this.setState({
      socket,
    });
  }

  killSocketConnection() {
    this.state.socket.emit("exit_room", {
      roomId: "1234",
      userId: "matanbroner",
    });
    this.state.socket.disconnect();
  }

  componentDidMount() {
    this.setupBeforeUnloadListener();
    this.setupSocketConnection();
  }

  componentWillUnmount() {
    this.killSocketConnection();
  }

  onCodeChange(code) {
    this.setState({
      editor: {
        ...this.state.editor,
        rawContent: code,
      },
    });
  }

  onLanguageChange(language) {
    this.setState({
      editor: {
        ...this.state.editor,
        rawContent: starterCode[language] || "",
        language,
      },
    });
  }

  clearEditor() {
    this.setState({
      editor: {
        ...this.state.editor,
        rawContent: "",
      },
      output: {
        stdout: "",
        stderr: "",
      },
    });
  }

  async compile() {
    this.setState({
      loading: true,
    });
    try {
      this.state.socket.emit("compile_init", {
        files: [
          {
            name: "main.py",
            content: this.state.editor.rawContent,
          },
        ],
        language: this.state.editor.language,
        roomId: "1234",
      });
    } catch (err) {
      alert(err);
    }
  }

  renderEditor() {
    return (
      <MonacoEditor
        height="100vh"
        language={this.state.editor.language}
        theme={this.state.editor.theme}
        value={this.state.editor.rawContent}
        onChange={this.onCodeChange.bind(this)}
        options={{
          automaticLayout: true,
          minimap: {
            enabled: false,
          },
        }}
      />
    );
  }

  renderClearModal() {
    Modal.confirm({
      title: "Clear Editor?",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to clear your editor? This action is irreversible.",
      okText: "Clear",
      cancelText: "Cancel",
      onOk: () => this.clearEditor(),
    });
  }

  render() {
    return (
      <Layout id={styles.wrapper}>
        <Content id={styles.content}>
          <SandboxHeader
            loading={this.state.loading}
            compile={this.compile.bind(this)}
            clear={this.renderClearModal.bind(this)}
            language={this.state.editor.language}
            onLanguageChange={(language) => this.onLanguageChange(language)}
          />
          <Layout style={{ height: "100%" }}>
            {/* <SandboxSidebar /> */}
            <Content style={{ height: "100%" }}>
              <Row id={styles.editorWrapper}>
                <Col span={16}>{this.renderEditor()}</Col>
                <Col span={8}>
                  <SandboxOutput
                    stdout={this.state.output.stdout}
                    stderr={this.state.output.stderr}
                  />
                </Col>
              </Row>
            </Content>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default Sandbox;
