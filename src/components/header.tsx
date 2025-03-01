"use client"

import { Pacifico } from "next/font/google";
import cx from "classnames";
import { headerStyle, headerTitleStyle } from "@/styles";
import { Text } from "@/components";
import { useDataContext } from "@/context/data-provider";

const titleFont = Pacifico({
  weight: "400",
  subsets: ["latin"],
});

export const Header = () => {
  const {data} = useDataContext();
  return (
    <div className={cx(titleFont.className, headerStyle)}>
      <Text variant="h2">
       {data.first_name} <span className={headerTitleStyle}>{data.last_name}</span>
      </Text>
      <div></div>
    </div>
  );
};
