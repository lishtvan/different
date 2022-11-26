/* eslint-disable react/display-name */
import { Close, Security } from "@mui/icons-material";
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
import { NOVA_POSHTA_DEPARTMENTS } from "~/constants/novaposhta";
import { ListboxComponent, StyledPopper } from "../ui/Autocomplete";

interface Props {
  isOpen: boolean;
  toggle: () => void;
}

const PurchaseModal: FC<Props> = ({ isOpen, toggle }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={toggle}
      fullWidth={true}
      className="flex justify-center items-center mx-auto"
    >
      <DialogTitle className="flex items-center justify-between w-full">
        <div className="font-bold">Placing an order</div>
        <IconButton onClick={toggle}>
          <Close />
        </IconButton>
      </DialogTitle>
      <div className="w-[450px] flex justify-start items-center flex-col px-5 gap-y-4">
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
          className="w-full mt-auto text-black"
        >
          Buyer protection mechanism
        </Button>
        <Button variant="contained" className="w-full mb-4">
          Checkout
        </Button>
      </div>
    </Dialog>
  );
};

export default PurchaseModal;
