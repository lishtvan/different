/* eslint-disable react/display-name */
import { Close } from "@mui/icons-material";
import type { AutocompleteChangeReason } from "@mui/material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number-2";
import type { FC, SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import { searchCity, searchDepartments } from "~/utils/novaposhta";
import novaposhtaLogo from "app/assets/nova-poshta.png";
import {
  Form,
  useActionData,
  useNavigation,
  useRouteLoaderData,
} from "@remix-run/react";
import type { RootLoaderData } from "~/types";

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
  const actionData = useActionData();
  const [cities, setCities] = useState<City[]>([]);
  const [city, setCity] = useState<City>();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const data = useActionData();
  const navigation = useNavigation();
  const [isDepartmentsLoading, setIsDepartmentsLoading] = useState(false);
  const { user } = useRouteLoaderData("root") as RootLoaderData;

  const onCityInputChange = async (cityName: string) => {
    setIsDepartmentsLoading(true);
    const cities = await searchCity(cityName);
    if (selectedDepartment) setSelectedDepartment(null);
    setCities(cities);
  };

  const onCityAutocompleteChange = (
    e: SyntheticEvent,
    value: City | null,
    reason: AutocompleteChangeReason
  ) => {
    if (reason === "clear") setCity(undefined);
    if (selectedDepartment) setSelectedDepartment(null);
    if (value) setCity(value);
  };

  const onDepartmentAutocompleteChange = (
    e: unknown,
    value: Department | null,
    reason: AutocompleteChangeReason
  ) => {
    if (reason === "clear") setSelectedDepartment(null);
    if (value) setSelectedDepartment(value);
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
        <input hidden name="CityRecipient" value={city?.DeliveryCity || ""} />
        <input
          hidden
          name="RecipientAddress"
          value={selectedDepartment?.Ref || ""}
        />
        <TextField
          className="w-full"
          name="firstName"
          label={actionData?.errors?.firstName || "Ім`я"}
          error={Boolean(actionData?.errors?.firstName)}
        />
        <TextField
          className="w-full"
          name="lastName"
          label={actionData?.errors?.lastName || "Фамілія"}
          error={Boolean(actionData?.errors?.lastName)}
        />
        <Autocomplete
          id="city"
          className="w-full"
          options={cities}
          noOptionsText={"Населений пункт не знайдено"}
          getOptionLabel={(o) => o.Present}
          onChange={onCityAutocompleteChange}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(e) => onCityInputChange(e.target.value)}
              value={city?.Present}
              placeholder="Введіть назву вашого населеного пункту"
              label={actionData?.errors?.CityRecipient || "Населений пункт"}
              error={Boolean(actionData?.errors?.CityRecipient)}
            />
          )}
        />
        <Autocomplete
          id="department"
          className="w-full"
          options={departments.filter(
            (d) => d.TypeOfWarehouse !== "f9316480-5f2d-425d-bc2c-ac7cd29decf0"
          )}
          noOptionsText={
            isDepartmentsLoading ? "Завантаження..." : "Відділення не знайдено"
          }
          getOptionLabel={(o) => o.Description}
          onChange={onDepartmentAutocompleteChange}
          value={selectedDepartment}
          renderInput={(params) => (
            <TextField
              {...params}
              label={
                actionData?.errors?.RecipientAddress || "Відділення Нової Пошти"
              }
              error={Boolean(actionData?.errors?.RecipientAddress)}
              placeholder={
                city
                  ? "Оберіть відділення"
                  : "Будь ласка, спочатку оберіть місто"
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
              ? "Недійсний номер телефону"
              : "Номер телефону"
          }
          onChange={() => {}}
          value={user?.phone}
          error={Boolean(data?.errors?.RecipientsPhone)}
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
        <Button
          type="submit"
          name="_action"
          value="createOrder"
          variant="contained"
          className="mb-4 w-full"
        >
          {navigation?.formData?.get("_action") === "createOrder"
            ? "Замовлення сворюється..."
            : "Створити замовлення"}
        </Button>
      </Form>
    </Dialog>
  );
};

export default PurchaseModal;
