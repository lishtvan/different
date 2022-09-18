import { Checkbox, FormControlLabel } from "@mui/material";
import FieldTitle from "./FieldTitle";
import novaposhtaIcon from "./../../assets/nova-poshta.png";
import ukrPoshtaIcon from "./../../assets/ukr-poshta.png";
import { useActionData } from "@remix-run/react";

const Shipping = () => {
  const actionData = useActionData();
  return (
    <div>
      <FieldTitle title="Shipping" required={true} />
      {actionData?.errors?.shipping && (
        <p className="ml-2 mb-1 text-[#d32f2f]">{actionData.errors.shipping}</p>
      )}
      <div className="flex flex-col ml-2 mt-6">
        <FormControlLabel
          control={
            <Checkbox name="shipping" value="novaPoshta" />
          }
          label={
            <div className="ml-1">
              <img
                src={novaposhtaIcon}
                height={50}
                width={100}
                alt="Nova Poshta"
              />
            </div>
          }
        />
        <FormControlLabel
          className="mt-4"
          control={
            <Checkbox name="shipping" value="ukrPoshta" />
          }
          label={
            <div className="ml-2.5">
              <img
                src={ukrPoshtaIcon}
                height={70}
                width={140}
                alt="Nova Poshta"
              />
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Shipping;
