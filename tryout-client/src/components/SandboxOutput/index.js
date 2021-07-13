import React from "react";
import styles from "./styles.module.css";

const SandboxOutput = (props) => {
  const languageUpper =
    props.language.charAt(0).toUpperCase() + props.language.slice(1);
  return (
    <div id={styles.wrapper}>
      <div id={styles.textArea}>
        <span>
          {languageUpper} environment ready! Press "Run" to test your code.
        </span>
        <br />
        <span>{props.stdout}</span>
        <br />
        <span id={styles.stderr}>{props.stderr}</span>
        <span id={styles.sysout}>{props.sysout}</span>
      </div>
    </div>
  );
};

export default SandboxOutput;
