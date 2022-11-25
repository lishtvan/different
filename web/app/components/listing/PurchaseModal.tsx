import { Close, Security } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import type { FC } from "react";
import { DESIGNERS } from "~/constants/listing";

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
        <TextField className="w-full" placeholder="Full name" />
        <TextField className="w-full" placeholder="Phone number" />
        <Autocomplete
          className="w-full"
          options={DESIGNERS}
          renderInput={(params) => (
            <TextField {...params} placeholder="Nova Poshta department" />
          )}
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
