import { MainView } from "@p-cloud/annotation";
import { useEffect, useRef } from "react";

import styles from "./index.module.less";

const MainViewFC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainView = new MainView();
    mainView.initialize(ref.current!);
    return () => {
      mainView.dispose();
    };
  }, []);

  return (
    <div className={styles["view-wrapper"]}>
      <div ref={ref} className={styles["view-container"]}></div>
    </div>
  );
};

export default MainViewFC;
