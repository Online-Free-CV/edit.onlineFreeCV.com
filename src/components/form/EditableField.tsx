import cx from "classnames";
import * as React from "react";
import { useFormikContext } from "formik";
import { editableFieldStyle } from "@/styles/editable-field.css";

interface EditableFieldProps {
  name: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({ name }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const [isEditing, setIsEditing] = React.useState(false);
  const editableRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const hasError = errors[name];
    if (hasError) {
      setIsEditing(true);
    }
  }, [values, errors]);
  React.useEffect(() => {
    if (isEditing && editableRef.current) {
      editableRef.current.focus();
    }
  }, [isEditing]);

  const hasError = errors[name];
  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    setFieldValue(name, e.target.innerText);
    setIsEditing(false);
  };

  return (
    <>
      <span
        ref={editableRef}
        data-placeholder={`${name} Required`}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onClick={() => setIsEditing(true)}
        className={cx(editableFieldStyle.default, {
          [editableFieldStyle.editing]: isEditing,
          [editableFieldStyle.error]: hasError,
        })}
      >
        {values[name]}
      </span>
      {/* {hasError && (
        <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {errors[name] as string}
        </span>
      )} */}
    </>
  );
};
