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
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { searchCity, searchDepartments } from "~/utils/novaposhta";

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

  const onCityChange = async (cityName: string) => {
    const cities = await searchCity(cityName);
    if (selectedDepartment) setSelectedDepartments(null);
    setCities(cities);
  };

  useEffect(() => {
    if (!city) return;
    searchDepartments(city.DeliveryCity).then((res) => setDepartments(res));
  }, [city]);
  console.log(departments.length);

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
          label="Name"
          placeholder="Enter your name"
        />
        <TextField
          className="w-full"
          label="Last Name"
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
          label="Phone number"
          onChange={() => {}}
          countryCodeEditable={false}
          onlyCountries={["ua"]}
          defaultCountry="ua"
          regions={["europe"]}
        />
        <Button
          variant="outlined"
          startIcon={<Security className="text-black" />}
          className="mt-auto w-full text-black"
        >
          Nova Poshta Safe Service
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
          Submit order
        </Button>
      </div>
    </Dialog>
  );
};

export default PurchaseModal;
