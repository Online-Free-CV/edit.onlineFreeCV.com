import { withFormik } from "@/hoc/withFormik";
import { InputField } from "./InputField";

interface MyFormValues {
  firstName: string;
}

const MyForm: React.FC<{ values: MyFormValues }> = () => (
  <>
  </>
);

export const Appform = withFormik(MyForm);
