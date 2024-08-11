import { FC, FormEvent, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import useApiClient from "../hooks/useApiClient";
import { useNotifier } from "../context/NotifierContext";
import FormField from "./FormField";
import { formDataToObj, withFormErrorSetter } from "../utils";

type LinkFormProps = {
  onSubmit: () => void;
  littleLinkId: number | null;
  setLittleLinkId: (id: number) => void;
};

const LinkForm: FC<LinkFormProps> = ({ onSubmit, setLittleLinkId }) => {
  const [isError, setIsError] = useState(false);
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

    if (response.ok) {
      const data = await response.json();
      setLittleLinkId(data.id);
      onSubmit();
    } else {
      notify.error("Something went wrong, try again later");
    }
  }

  const aliasLabel = `alias (${
    authContext.isUserLoggedIn ? "optional" : "for logged in users"
  })`;

  return (
    <section className="center-page card">
      <form onSubmit={createLittleLink}>
        <p className="form-title">Create your little link</p>
        <FormField type="url" label="url" name="url" required={true} />
        <FormField
          label={aliasLabel}
          name="alias"
          validator={withFormErrorSetter(aliasValidator, setIsError)}
        />
        <button className="form-button" type="submit">
          Create little link
        </button>
      </form>
    </section>
  );
};

export default LinkForm;

function aliasValidator(alias: string): string | null {
  if (alias.length > 10) {
    return "alias to long";
  }
  return null;
}
