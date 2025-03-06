import * as React from "react";
import { useFormikContext } from "formik";

interface EditableFieldProps {
  name: string;
  children: React.ReactNode;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  name,
  children,
}) => {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const [isEditing, setIsEditing] = React.useState(false);
  const editableRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    console.log("EditableField values", values);
    console.log("EditableField errors", errors);
    const hasError = errors[name];
    console.log("EditableField hasError", hasError);
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
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
        onClick={() => setIsEditing(true)}
        style={
          isEditing
            ? {
                outline: hasError
                  ? "1px solid red"
                  : "1px solid rgb(94, 101, 109)",
                outlineOffset: "5px",
                minWidth: "200px",
                width: "100px",
                display: "inline-block",
                cursor: "text",
              }
            : {}
        }
      >
        {values[name]}
      </span>
      {hasError && (
        <span style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
          {errors[name] as string}
        </span>
      )}
    </>
  );
};
