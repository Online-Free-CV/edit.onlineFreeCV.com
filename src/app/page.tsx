"use client"

import { Title } from "@/components/sections/title";
import { sectionDetailsStyle, summaryStyle } from "@/styles";
import { Raleway } from "next/font/google";
import cx from "classnames";
import { useDataContext } from "@/context/data-provider";
import { Container, Text } from "@onlinefreecv/design-system";
import { EditableField } from "@/components/form/EditableField";
import { useFormikContext } from "formik";

const raleway = Raleway({
  subsets: ["latin"],
});

export default function Home() {
  const { values } = useFormikContext<any>();
  return (
    <div className={sectionDetailsStyle}>
      <Title title="About Me" />
      <div>
        <Text variant="display" className={cx(raleway.className, summaryStyle)}><EditableField name="summary" /></Text>
        <Text variant="h3" className={cx(raleway.className, summaryStyle)}>Objectives</Text>
        <Text variant="display" className={cx(raleway.className, summaryStyle)}><EditableField name="about_me" /></Text>
        <Text variant="h3" className={cx(raleway.className, summaryStyle)}>What I do!</Text>

      </div>

    </div>
  );
}
