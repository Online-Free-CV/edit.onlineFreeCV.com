"use client";

import { useState } from "react";
import { Pacifico } from "next/font/google";
import cx from "classnames";
import { headerStyle, headerTitleStyle } from "@/styles";
import { Text } from "@onlinefreecv/design-system";
import { useDataContext } from "@/context/data-provider";
import { InputField } from "./form/InputField";
import { EditableField } from "./form/EditableField";
import { useFormik, useFormikContext } from "formik";

const titleFont = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

export const Header = () => {
   const { values } = useFormikContext<any>();

  return (
    <div
      className={cx(titleFont.className, headerStyle)}
    >
      <Text variant="h1">
        <EditableField name="first_name">{values.first_name}</EditableField>{" "}
        <span className={headerTitleStyle}>
          <EditableField name="last_name">{values.last_name}</EditableField>
        </span>
      </Text>
    </div>
  );
};
