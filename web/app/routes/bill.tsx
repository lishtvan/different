import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import ErrorBoundaryComponent from "~/components/platform/ErrorBoundary";
import { fetcher } from "~/fetcher.server";
import monopay from "../assets/monopay.png";
import mastercard from "../assets/mastercard.png";
import visa from "../assets/visa.png";
import applepay from "../assets/applepay.png";
import googlepay from "../assets/googlepay.png";

interface SoldItem {
  price: number;
  title: string;
  id: string;
  commission: string;
}

interface Bill {
  soldItems: SoldItem[];
  totalCommission: number;
}

export const loader: LoaderFunction = async ({ request }) => {
  const response = await fetcher({
    request,
    method: "POST",
    route: "/bill/get",
  });
  if (response.status === 400) return redirect("/");
  return response;
};

export const action: ActionFunction = async ({ request }) => {
  const response = await fetcher({
    request,
    method: "POST",
    route: "/bill/getPaymentLink",
  });
  if (response.status === 400) return;
  const { paymentLink } = await response.json();

  return redirect(paymentLink);
};

const BillRoute = () => {
  const loaderData = useLoaderData<Bill>();

  return (
    <div className="flex min-h-[calc(100vh-74px)] w-full items-center justify-center ">
      <div className="mb-20 w-fit">
        <div className="ml-4">
          <h1 className="mt-2 text-2xl font-bold">
            Дякуємо, що обрали <span className="text-main">Different</span>
          </h1>
          <div className="mt-4 text-2xl">
            Щоб продовжити користуватися сайтом Вам потрібно <br /> сплатити
            комісію за продані речі.
          </div>
        </div>
        <TableContainer sx={{ maxWidth: 900 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="text-xl font-semibold">
                  Оголошення
                </TableCell>
                <TableCell className="text-xl font-semibold">Ціна</TableCell>
                <TableCell className="text-xl font-semibold">
                  Комісія (5%)
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="max-h-96 overflow-y-scroll">
              {loaderData?.soldItems.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell
                    className="flex items-center gap-x-3 text-xl"
                    component="th"
                    scope="row"
                  >
                    {row.title}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xl">
                    {row.price} грн
                  </TableCell>
                  <TableCell className="text-xl text-main">
                    {row.commission} грн
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="ml-4 mt-4 flex items-center">
          {loaderData?.soldItems.length > 1 && (
            <div className="text-xl font-semibold">
              Всього до сплати:{" "}
              <span className="text-main">
                {loaderData?.totalCommission} грн
              </span>
            </div>
          )}
          <Form className="ml-auto" method="POST">
            <Button type="submit" variant="contained">
              Сплатити
            </Button>
          </Form>
        </div>
        <div className="ml-4 mt-4 flex items-center gap-x-4">
          <img width={100} src={monopay} alt="monopay" />
          <img width={40} src={mastercard} alt="mastercard" />
          <img width={50} src={visa} alt="visa" />
          <img width={55} src={applepay} alt="applepay" />
          <img width={55} src={googlepay} alt="googlepay" />
        </div>
        <div className="ml-4 mt-8">
          Якщо у вас виникли питання, зверніться в{" "}
          <a
            href="https://t.me/DifferentMarketplace"
            className="text-blue-500 underline underline-offset-[5px]"
            target="_blank"
            rel="noreferrer"
          >
            підтримку.
          </a>
        </div>
      </div>
    </div>
  );
};

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
export default BillRoute;
