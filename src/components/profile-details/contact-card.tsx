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
import { Text } from "@/components";
import { useDataContext } from "@/context/data-provider";

const raleway = Raleway({
  weight: "500",
  subsets: ["latin"],
});

interface IContactCardItemProps {
  children: React.ReactNode;
  label: string;
  data: string;
}

export const ContactCardItem: React.FC<IContactCardItemProps> = ({
  children,
  label,
  data,
}: IContactCardItemProps) => (
  <div className={contactCardStyle}>
    {children}
    <div className={cx(contactCardDataStyle, raleway.className)}>
      <Text variant="body1" className={cx(contactCardLabelStyle)}>
        {label}
      </Text>
      <Text variant="body1" className={cx(raleway.className)}>
        {data}
      </Text>
    </div>
  </div>
);

export const ContactCard = () => {
  const {data} = useDataContext();
  return (
    <div className={contactCardContainerStyle}>
      <div className={contactCardWrapperStyle}>
        <ContactCardItem label="Phone" data={data.phone_number}>
          <Phone />
        </ContactCardItem>
        <ContactCardItem label="Email" data={data.email}>
          <Email />
        </ContactCardItem>
        <ContactCardItem label="Location" data={data.location}>
          <Location />
        </ContactCardItem>
      </div>
    </div>
  );
};
