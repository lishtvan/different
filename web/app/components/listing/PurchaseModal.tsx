/* eslint-disable react/display-name */
import { CheckBox, Close } from "@mui/icons-material";
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
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { searchCity, searchDepartments } from "~/utils/novaposhta";
import novaposhtaLogo from "app/assets/nova-poshta.png";
import { Form, useActionData } from "@remix-run/react";

interface City {
  DeliveryCity: string;
  Present: string;
}

interface Department {
  Description: string;
  CityRef: string;
  Ref: string;
  TypeOfWarehouse: string;
}

interface Props {
  isOpen: boolean;
  toggle: () => void;
}

const PurchaseModal: FC<Props> = ({ isOpen, toggle }) => {
  const { t } = useTranslation();
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City>();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartments] =
    useState<Department | null>(null);
  const data = useActionData();

  const onCityChange = async (cityName: string) => {
    const cities = await searchCity(cityName);
    if (selectedDepartment) setSelectedDepartments(null);
    setCities(cities);
  };

  useEffect(() => {
    if (!city) return;
    searchDepartments(city.DeliveryCity).then((res) => setDepartments(res));
  }, [city]);

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
      <Form
        method="post"
        className="flex w-[450px] flex-col items-center justify-start gap-y-4 px-5"
      >
        <input
          hidden
          name="CityRecipient"
          value={selectedDepartment?.CityRef}
        />
        <input hidden name="RecipientAddress" value={selectedDepartment?.Ref} />
        <TextField
          className="w-full"
          label="Name"
          name="firstName"
          placeholder="Enter your name"
        />
        <TextField
          className="w-full"
          label="Last Name"
          name="lastName"
          placeholder="Enter your name"
        />
        <Autocomplete
          id="city"
          className="w-full"
          options={cities}
          getOptionLabel={(o) => o.Present}
          onChange={(e, value) => {
            if (value) setCity(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="City"
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Enter your city name"
            />
          )}
        />
        <Autocomplete
          id="department"
          className="w-full"
          options={departments.filter(
            (d) => d.TypeOfWarehouse !== "f9316480-5f2d-425d-bc2c-ac7cd29decf0"
          )}
          getOptionLabel={(o) => o.Description}
          onChange={(e, value) => {
            if (value) setSelectedDepartments(value);
          }}
          value={selectedDepartment}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Nova Poshta department"
              placeholder={
                city
                  ? "Enter Nova Poshta department"
                  : "Please, select city first"
              }
            />
          )}
        />
        <MuiPhoneNumber
          className="w-full"
          variant="outlined"
          name="RecipientsPhone"
          label={
            data?.errors?.RecipientsPhone
              ? "Phone number is invalid"
              : "Phone number"
          }
          onChange={() => {}}
          error={data?.errors?.RecipientsPhone}
          countryCodeEditable={false}
          onlyCountries={["ua"]}
          defaultCountry="ua"
          regions={["europe"]}
        />
        <a
          href="https://novaposhta.ua/safeservice/"
          target="_blank"
          rel="noreferrer"
          className="mt-auto w-full"
        >
          <Button
            variant="outlined"
            startIcon={<img src={novaposhtaLogo} width={70} alt="novaposhta" />}
            className="w-full text-lg normal-case text-black"
          >
            Safe Service
          </Button>
        </a>
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
        <Button
          type="submit"
          name="_action"
          value="createOrder"
          variant="contained"
          className="mb-4 w-full"
        >
          Submit order
        </Button>
      </Form>
    </Dialog>
  );
};

export default PurchaseModal;
