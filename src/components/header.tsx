"use client"

import { useState } from "react";
import { Pacifico } from "next/font/google";
import cx from "classnames";
import { headerStyle, headerTitleStyle } from "@/styles";
import { Text } from "@onlinefreecv/design-system";
import { useDataContext } from "@/context/data-provider";
import { InputField } from "./form/InputField";

const titleFont = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

export const Header = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data } = useDataContext();
  return (
    <div className={cx(titleFont.className, headerStyle)} onClick={() => setIsEditing(true)}>
      {isEditing ? (
        <>
        <InputField label="First Name" name="first_name" />
        <InputField label="Last Name" name="last_name" />
        </>
      ) : (
        <Text variant="h1">
          {data.first_name} <span className={headerTitleStyle}>{data.last_name}</span>
        </Text>)
      }
      <div></div>
    </div>
  );
};
