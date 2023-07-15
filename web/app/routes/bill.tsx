import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { type LoaderFunction } from "@remix-run/node";
import ErrorBoundaryComponent from "~/components/platform/ErrorBoundary";
import { fetcher } from "~/fetcher.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const response = await fetcher({
    request,
    method: "POST",
    route: "/bill/get",
  });

  return response;
};

const BillRoute = () => {
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
              {[
                {
                  price: 100,
                  comission: 5,
                  title: "shoes",
                },
                {
                  price: 100,
                  comission: 5,
                  title: "shoes",
                },
              ].map((row) => (
                <TableRow
                  key={"2"}
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
                    {row.comission} грн
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="ml-4 mt-4 flex items-center">
          <div className="text-xl font-semibold">
            Всього до сплати: <span className="text-main">15 грн</span>
          </div>
          <Button className="ml-auto" variant="contained">
            Сплатити
          </Button>
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
