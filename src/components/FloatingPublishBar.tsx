import React from "react";
import { useFormikContext } from "formik";
import { floatingBar, floatingBarExit, publishButton } from "@/styles/";
import { Text } from "@onlinefreecv/design-system";

export const FloatingPublishBar = () => {
  const { submitForm, dirty } = useFormikContext();
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
      <button onClick={() => submitForm()} className={publishButton}>
        <Text variant="body1">Publish Changes</Text>
      </button>
    </div>
  );
};
