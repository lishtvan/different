import { useActionData, useLoaderData } from "@remix-run/react";
import FieldTitle from "./FieldTitle";
import MuiPhoneNumber from "material-ui-phone-number-2";

const SellerPhone = () => {
  const actionData = useActionData();
  const loaderData = useLoaderData();

  return (
    <div>
      <FieldTitle title={"Номер телефону"} required={true} />
      <MuiPhoneNumber
        className="w-full"
        variant="outlined"
        name="phone"
        value={loaderData.phone}
        onChange={() => {}}
        error={actionData?.errors?.phone}
        countryCodeEditable={false}
        onlyCountries={["ua"]}
        defaultCountry="ua"
        regions={["europe"]}
      />
      {actionData?.errors?.phone && (
        <p className="ml-2 mt-1 text-[#d32f2f]">{actionData.errors.phone}</p>
      )}
    </div>
  );
};
export default SellerPhone;
