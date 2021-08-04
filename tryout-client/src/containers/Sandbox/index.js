import React from "react";
import WebSocketClient from "../../socket/client";
import ShareDBMonaco from "sharedb-monaco";
import MonacoEditor from "react-monaco-editor";
import { Row, Col, Layout, Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import SandboxSidebar from "../../components/SandboxSidebar";
import SandboxHeader from "../../components/SandboxHeader";
import SandboxOutput from "../../components/SandboxOutput";

import constants from "../../socket/constants";
import starterCode from "../../assets/starterCode";
import styles from "./styles.module.css";

const { Content } = Layout;

const wsServerEndpoint = "ws://127.0.0.1:5700";

class Sandbox extends React.Component {
  constructor(props) {
    super(props);
    const initialLanguage = "python";
    this.state = {
      loading: false,
      editor: {
        rawContent: "Loading...",
        language: initialLanguage,
        theme: "vs-dark",
      },
      output: {
        stdout: "",
        stderr: "",
        sysout: "",
      },
      modals: {
        clearEditor: false,
      },
    };
  }

  componentDidMount() {
    this.setupBeforeUnloadListener();
  }

  componentWillUnmount() {
    this.killConnection();
  }

  editorDidMount(editor, monaco) {
    this.setupShareDbConnection(editor);
    editor.focus();
  }

  // catch browser tab close event
  setupBeforeUnloadListener = () => {
    window.addEventListener(
      "beforeunload",
      function (ev) {
        ev.preventDefault();
        return this.killConnection();
      }.bind(this)
    );
  };

  async setupSocketConnection(ws) {
    const that = this;
    const socket = new WebSocketClient({
      ws,
      noMessageEventHandler: true,
    });
    socket.setCustomEventHandlers({
      [constants.COMPILE_COMPLETE]: (data) => {
        that.setState({
          loading: false,
          output: {
            stdout: data.stdout,
            stderr: data.stderr,
            sysout: data.sysout,
          },
        });
      },
    });
    socket.send({
      event: constants.JOIN_ROOM,
      data: {
        roomId: "1234",
        userId: "matanbroner",
      },
    });
    this.setState({
      socket,
    });
  }

  setupShareDbConnection(editor) {
    let that = this;
    const shareDbBinding = new ShareDBMonaco({
      request: {
        test_ns: ["test_doc_2"],
      },
      activeDoc: ["test_ns", "test_doc_2"],
      wsurl: wsServerEndpoint,
    });
    that.setupSocketConnection(shareDbBinding.WS);

    shareDbBinding.on(constants.READY, () => {
      shareDbBinding.connection.on("receive", function (request) {
        const message = request.data;
        if (message.internal) {
          that.state.socket.handleEvent(message);
          // prevent ShareDB connection handler from processing
          // this message
          request.data = null;
        }
      });
      that.state.socket.sendRequestId();
      shareDbBinding.add(editor, "content");
    });
    this.setState({
      shareDbBinding,
    });
  }

  killConnection() {
    this.state.socket.send({
      event: constants.EXIT_ROOM,
      data: {
        roomId: "1234",
        userId: "matanbroner",
      },
    });
    this.state.shareDbBinding.close();
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
        rawContent: starterCode[language].code.trim() || "",
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
      this.state.socket.send({
        event: constants.COMPILE_INIT,
        data: {
          files: [
            {
              name: starterCode[this.state.editor.language].file,
              content: this.state.editor.rawContent,
            },
          ],
          language: this.state.editor.language,
          roomId: "1234",
        },
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
        editorDidMount={this.editorDidMount.bind(this)}
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
            <SandboxSidebar
              files={[
                {
                  name: starterCode[this.state.editor.language].file,
                },
              ]}
            />
            <Content style={{ height: "100%" }}>
              <Row id={styles.editorWrapper}>
                <Col span={16}>{this.renderEditor()}</Col>
                <Col span={8}>
                  <SandboxOutput
                    language={this.state.editor.language}
                    stdout={this.state.output.stdout}
                    stderr={this.state.output.stderr}
                    sysout={this.state.output.sysout}
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
