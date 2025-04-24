import { sectionDetailsTitleStyle } from "@/styles";
import { Poppins } from "next/font/google";
import cx from "classnames";
import { Container, Text } from "@onlinefreecv/design-system";

const poppins = Poppins({
  weight: "500",
  subsets: ["latin"],
});

interface ITitleProps {
  title: string;
}
export const Title = ({ title }: ITitleProps) => (
  <div className={cx(sectionDetailsTitleStyle, poppins.className)}>
    <Text variant="h1" >
      {title}
    </Text>
    <span></span>
  </div>
);
