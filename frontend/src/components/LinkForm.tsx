import { FC, FormEvent, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNotifier } from "../context/NotifierContext";
import { formDataToObj } from "../lib/utils";
import { Form, FormError, FormField } from "./Form";
import { useApiClient } from "../lib/hooks/useApiClient";
import { aliasValidator } from "../lib/field-validators";
import { FormValidationContext } from "../context/FormValidationContext";

type LinkFormProps = {
  onSubmit: () => void;
  littleLinkId: number | null;
  setLittleLinkId: (id: number) => void;
};

const LinkForm: FC<LinkFormProps> = ({ onSubmit, setLittleLinkId }) => {
  const [isValidationError, setIsValidationError] = useState(false);
  const [apiResponseErrorText, setApiResponseErrorText] = useState<
    string | null
  >(null);

  const { authContext } = useAuthContext();
  const apiClient = useApiClient();
  const notify = useNotifier();

  async function createLittleLink(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isValidationError) return;

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
      setApiResponseErrorText(data.detail);
    } else {
      notify.error("Something went wrong, try again later");
    }
  }

  const aliasLabel = `alias (${
    authContext.isUserLoggedIn ? "optional" : "for logged in users"
  })`;

  const onFormErrorClose = () => {
    setApiResponseErrorText("");
  };

  return (
    <FormValidationContext.Provider value={setIsValidationError}>
      <Form
        title="Create your little link"
        onSubmit={createLittleLink}
        buttonText="Create little link"
      >
        {apiResponseErrorText && (
          <FormError onClose={onFormErrorClose}>
            {apiResponseErrorText}
          </FormError>
        )}
        <FormField type="url" label="url" name="url" required />
        <FormField
          label={aliasLabel}
          name="alias"
          validator={aliasValidator}
          disabled={!authContext.isUserLoggedIn}
        />
      </Form>
    </FormValidationContext.Provider>
  );
};

export default LinkForm;
