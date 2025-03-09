import * as React from "react";
import {switchContainer, switchLabel, slider } from "@/styles";
import { useFormikContext } from "formik";

const Switch: React.FC = () => {
    const { values, setFieldValue } = useFormikContext<any>();

    React.useEffect(() => { 
        document.documentElement.dir = values.direction;
    }
    , [values.direction]);

    const handleChangeDirection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const direction = e.target.checked ? "rtl" : "ltr";
        setFieldValue("direction", direction);
    };
  return (
    <div className={switchContainer}>
      <label className={switchLabel}>
        <input
          type="checkbox"
          checked={values.direction === "rtl"}
          onChange={handleChangeDirection}
        />
        <span className={slider}></span>
      </label>
      <span style={{ marginLeft: "10px" }}>Switch to LTR</span>
    </div>
  );
};

export default Switch;