import React from "react";
import MonacoEditor from "react-monaco-editor";

import { Row, Col, Layout, Modal, Button } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import SandboxSidebar from "../../components/SandboxSidebar";
import SandboxHeader from "../../components/SandboxHeader";
import SandboxOutput from "../../components/SandboxOutput";
import styles from "./styles.module.css";

const superagent = require("superagent");

const { Content } = Layout;

class Sandbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      editor: {
        rawContent: "",
        language: "python",
        theme: "vs-dark",
      },
      output: {
        stdout: "",
        stderror: "",
      },
      modals: {
        clearEditor: false,
      },
    };
  }

  onCodeChange(code) {
    this.setState({
      editor: {
        ...this.state.editor,
        rawContent: code,
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
        stderror: "",
      },
    });
  }

  async compile() {
    this.setState({
      loading: true,
    });
    try {
      const res = await superagent.post("http://0.0.0.0:5700/compile").send({
        code: this.state.editor.rawContent,
        language: "python",
      });
      console.log(res.body);
      this.setState({
        loading: false,
        output: {
          stdout: res.body.stdout,
          stderror: res.body.stderror,
        },
      });
    } catch (err) {
      alert(err);
    }
  }

  renderEditor() {
    return (
      <MonacoEditor
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
        <Content>
          <SandboxHeader
            loading={this.state.loading}
            compile={this.compile.bind(this)}
            clear={this.renderClearModal.bind(this)}
          />
          <Layout style={{ height: "100%" }}>
            {/* <SandboxSidebar /> */}
            <Content>
              <Row id={styles.editorWrapper}>
                <Col span={16}>{this.renderEditor()}</Col>
                <Col span={8}>
                  <SandboxOutput
                    stdout={this.state.output.stdout}
                    stderror={this.state.output.stderror}
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
