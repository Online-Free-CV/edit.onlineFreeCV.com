// filepath: /Users/mac/Desktop/Product/edit.onlineFreeCV.com/src/components/profile-details/index.tsx
"use client"

import {
  detailsContainerStyle,
  profileCardStyle,
  profileDetailsSubTileStyle,
  profileDetailsTileStyle,
  profileImageStyle,
} from "@/styles";
import Image from "next/image";
import cx from "classnames";
import { Raleway } from "next/font/google";
import { ContactCard } from "./contact-card";
import { Socials } from "./socials";
import { Text } from "@onlinefreecv/design-system";
import { useDataContext } from "@/context/data-provider";
import { useState } from "react";
import GooglePicker from "../GooglePicker";
import { useFormikContext } from "formik";
import { EditableField } from "../form/EditableField";

const railwayTitle = Raleway({
  weight: "600",
  subsets: ["latin"],
});

const railwaySubTitle = Raleway({
  weight: "400",
  subsets: ["latin"],
});

export const ProfileCard = () => {
  const { values } = useFormikContext<any>();
  const [imageUrl, setImageUrl] = useState(values.picture);
  return (
    <div className={profileCardStyle}>
      <Image
        src={imageUrl}
        width={200}
        height={200}
        className={profileImageStyle}
        alt={values.name}
      />
      {/* <GooglePicker setImageUrl={setImageUrl} accessToken={data.access_token} /> */}
      <div className={cx(detailsContainerStyle)}>
        <Text
          variant="h2"
          className={cx(railwayTitle.className, profileDetailsTileStyle)}
        >
          <EditableField name="full_name">{values.full_name}</EditableField>
        </Text>
        <Text
          variant="display"
          className={cx(railwaySubTitle.className, profileDetailsSubTileStyle)}
        >
          <EditableField name="current_position">
          {values.current_position}
          </EditableField>
        </Text>
        <Socials />
        <ContactCard />
      </div>
    </div>
  );
};