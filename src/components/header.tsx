"use client";

import { headerStyle, headerTitleStyle } from "@/styles";
import { Container, Text } from "@onlinefreecv/design-system";
import cx from "classnames";
import { Pacifico } from "next/font/google";
import { EditableField } from "./form/EditableField";

const titleFont = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

export const Header = () => {

  return (
    <div
      className={cx(titleFont.className, headerStyle)}
    >
      <Text variant="h1">
        <EditableField name="first_name"/>{" "}
        <span className={headerTitleStyle}>
          <EditableField name="last_name" />
        </span>
      </Text>
      <Text variant="h1">
        <EditableField name="website_name" />
      </Text>

    </div>    
  );
};
