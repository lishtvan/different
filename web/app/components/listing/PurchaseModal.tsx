/* eslint-disable react/display-name */
import { CheckBox, Close, Security } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number-2";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NOVA_POSHTA_DEPARTMENTS } from "~/constants/novaposhta";
import { ListboxComponent, StyledPopper } from "../ui/Autocomplete";

interface Props {
  isOpen: boolean;
  toggle: () => void;
}

const PurchaseModal: FC<Props> = ({ isOpen, toggle }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={isOpen}
      onClose={toggle}
      fullWidth={true}
      className="mx-auto flex items-center justify-center"
    >
      <DialogTitle className="flex w-full items-center justify-between">
        <div className="font-bold">Placing an order</div>
        <IconButton onClick={toggle}>
          <Close />
        </IconButton>
      </DialogTitle>
      <div className="flex w-[450px] flex-col items-center justify-start gap-y-4 px-5">
        <TextField
          className="w-full"
          label="Full name"
          placeholder="Enter your full name"
        />
        <MuiPhoneNumber
          className="w-full"
          variant="outlined"
          label="Phone number"
          onChange={() => {}}
          countryCodeEditable={false}
          onlyCountries={["ua"]}
          defaultCountry="ua"
          regions={["europe"]}
        />
        <Autocomplete
          id="virtualize-demo"
          className="w-full"
          disableListWrap
          PopperComponent={StyledPopper}
          ListboxComponent={ListboxComponent}
          options={NOVA_POSHTA_DEPARTMENTS}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Nova Poshta department"
              placeholder="Enter Nova Poshta department"
            />
          )}
          renderOption={(props, option) => [props, option] as React.ReactNode}
        />
        <Button
          variant="outlined"
          startIcon={<Security className="text-black" />}
          className="mt-auto w-full text-black"
        >
          Buyer protection mechanism
        </Button>
        <div className="mt-auto flex items-center text-base">
          <CheckBox fontSize="small" className="mr-1 text-main" />
          <div>{t("I agree with")}</div>
          <Link
            target="_blank"
            className="ml-1 text-blue-500 underline underline-offset-[4px]"
            to="/info?q=terms"
          >
            {t("Terms of Service")}
          </Link>
          {","}
          <Link
            target="_blank"
            className="ml-1 text-blue-500 underline underline-offset-[4px]"
            to="/info?q=payment"
          >
            {t("Payment and Delivery")}
          </Link>
        </div>

        <Button variant="contained" className="mb-4 w-full">
          Checkout
        </Button>
      </div>
    </Dialog>
  );
};

export default PurchaseModal;
