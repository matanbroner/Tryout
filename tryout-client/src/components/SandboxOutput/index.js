import React from "react";
import styles from "./styles.module.css";

const SandboxOutput = (props) => {
  return (
    <div id={styles.wrapper}>
      <div id={styles.textArea}>
        <span>Python 3.8.4 (default, Jul 14 2020, 02:58:48)</span>
        <br />
        <span>{props.stdout}</span>
        <br />
        <span id={styles.stderr}>{props.stderr}</span>
      </div>
    </div>
  );
};

export default SandboxOutput;
