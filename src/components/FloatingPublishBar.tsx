import { floatingBar, floatingBarExit, publishButton } from "@/styles/";
import { Text } from "@onlinefreecv/design-system";
import { useFormikContext } from "formik";
import React from "react";

export const FloatingPublishBar = () => {
  const { dirty } = useFormikContext();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  React.useEffect(() => {
    if (dirty) {
      setIsVisible(true);
      setIsExiting(false);
    } else {
      setIsExiting(true);
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [dirty]);

  if (!isVisible) return null;

  return (
    <div className={`${floatingBar} ${isExiting ? floatingBarExit : ""}`}>
      <Text variant="h2">Online Free CV</Text>
      <button className={publishButton} type="submit">
        <Text variant="body1">Publish Changes</Text>
      </button>
    </div>
  );
};
