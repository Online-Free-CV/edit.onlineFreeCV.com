"use client"

import { Email, Phone, Location } from "@/assets/icons/gernal";
import {
  contactCardContainerStyle,
  contactCardDataStyle,
  contactCardLabelStyle,
  contactCardStyle,
  contactCardWrapperStyle,
} from "@/styles";
import { Raleway } from "next/font/google";
import cx from "classnames";
import { Text } from "@onlinefreecv/design-system";
import { useDataContext } from "@/context/data-provider";
import { EditableField } from "../form/EditableField";
import { Container } from "@onlinefreecv/design-system";
import { useFormikContext } from "formik";

const raleway = Raleway({
  weight: "500",
  subsets: ["latin"],
});

interface IContactCardItemProps {
  children: React.ReactNode;
  label: string;
  name: string;
}

export const ContactCardItem: React.FC<IContactCardItemProps> = ({
  children,
  label,
  name,
}: IContactCardItemProps) => {
  const {values} = useFormikContext<any>();
  return(
  <div className={contactCardStyle}>
    {children}
    <div className={cx(contactCardDataStyle, raleway.className)}>
      <Text variant="body1" className={cx(contactCardLabelStyle)}>
        {label}
      </Text>
      <Text variant="body1" className={cx(raleway.className)}>
        <EditableField name={name} />
      </Text>
    </div>
  </div>
)};

export const ContactCard = () => {
  const {values} = useFormikContext<any>();
  return (
    <Container variant="wrapper" direction={values.direction} className={contactCardContainerStyle}>
      <div className={contactCardWrapperStyle}>
        <ContactCardItem label="Phone" name="phone_number">
          <Phone />
        </ContactCardItem>
        <ContactCardItem label="Email" name="email">
          <Email />
        </ContactCardItem>
        <ContactCardItem label="Location" name="location">
          <Location />
        </ContactCardItem>
      </div>
    </Container>
  );
};
