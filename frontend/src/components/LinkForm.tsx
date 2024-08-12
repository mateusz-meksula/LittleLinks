import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import useApiClient from "../hooks/useApiClient";
import { useNotifier } from "../context/NotifierContext";
import FormField from "./FormField";
import { formDataToObj, withFormErrorSetter } from "../utils";
import Form from "./Form";

type LinkFormValues = {
  url: string;
  alias: string;
};

type LinkFormProps = {
  onSubmit: () => void;
  littleLinkId: number | null;
  setLittleLinkId: (id: number) => void;
};

const LinkForm: FC<LinkFormProps> = ({ onSubmit, setLittleLinkId }) => {
  const [isError, setIsError] = useState(false);
  const [formErrorText, setFormErrorText] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<LinkFormValues>({
    url: "",
    alias: "",
  });

  const { authContext } = useAuthContext();
  const apiClient = useApiClient();
  const notify = useNotifier();

  async function createLittleLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isError) return;

    const requestBody = formDataToObj(new FormData(e.currentTarget));
    const response = await apiClient("/links/", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();

    if (response.ok) {
      setLittleLinkId(data.id);
      onSubmit();
    } else if (response.status === 409) {
      setFormErrorText(data.detail);
    } else {
      notify.error("Something went wrong, try again later");
    }
  }

  const aliasLabel = `alias (${
    authContext.isUserLoggedIn ? "optional" : "for logged in users"
  })`;

  const fieldOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  return (
    <Form
      title="Create your little link"
      onSubmit={createLittleLink}
      buttonText="Create little link"
      errorText={formErrorText}
    >
      <FormField
        type="url"
        label="url"
        name="url"
        required={true}
        formValues={formValues}
        onChange={fieldOnChange}
      />
      <FormField
        label={aliasLabel}
        name="alias"
        formValues={formValues}
        onChange={fieldOnChange}
        validator={withFormErrorSetter(aliasValidator, setIsError)}
      />
    </Form>
  );
};

export default LinkForm;

function aliasValidator(alias: string): string | null {
  if (alias.length > 10) {
    return "alias to long";
  }
  return null;
}
