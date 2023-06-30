import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link } from "@remix-run/react";
import ErrorBoundaryComponent from "~/components/platform/ErrorBoundary";

const rows = [
  {
    id: "f70b66ac-5a46-4fce-a5da-906ccae2aac9",
    status: "Очікування на відправку",
    createdAt: "2023-06-29T15:08:43.059Z",
    color: "text-yellow-500",
    trackingNumber: "20450734754975",
    buyer: {
      nickname: "lishtvan",
      avatarUrl:
        "https://s3.eu-central-1.amazonaws.com/different.dev/dlnbpJCUQ3udjm6zQ9hxNw-0000000000:w=960&h=1280",
    },
    listing: {
      price: 22,
      title: "Vintage Russell Athletics Big Logo Sweatshirt Faded",
      id: 22,
      imageUrls: [
        "https://s3.eu-central-1.amazonaws.com/different.dev/G07-pjY0SuC9HA-D9jwBIQ-0000000000:w=960&h=1280",
      ],
    },
  },
  {
    id: "e1a8983b-3d9c-4c47-b492-883296ed2281",
    status: "Очікування на оплату",
    createdAt: "2023-06-29T15:09:58.935Z",
    trackingNumber: "20450734755516",
    color: "text-orange-600",
    buyer: {
      nickname: "lishtvan",
      avatarUrl:
        "https://s3.eu-central-1.amazonaws.com/different.dev/dlnbpJCUQ3udjm6zQ9hxNw-0000000000:w=960&h=1280",
    },
    listing: {
      price: 22,
      title: "Vintage Diesel Green Faded Denim Avant Garde Crossbody Bag",
      id: 23,
      imageUrls: [
        "https://s3.eu-central-1.amazonaws.com/different.dev/D9JsIaF-Tg-RS9AWsCbsEQ-0000000000:w=1280&h=1061",
      ],
    },
  },
  {
    id: "e1a8983b-3d9c-4c47-b492-883296ed223",
    status: "Товар в дорозі",
    createdAt: "2023-06-29T15:09:58.935Z",
    trackingNumber: "20450734755516",
    color: "text-blue-500",
    buyer: {
      nickname: "lishtvan",
      avatarUrl:
        "https://s3.eu-central-1.amazonaws.com/different.dev/dlnbpJCUQ3udjm6zQ9hxNw-0000000000:w=960&h=1280",
    },
    listing: {
      price: 22,
      title: "Vintage Memphis Kanye West Style Platform Boots Work 42",
      id: 23,
      imageUrls: [
        "https://s3.eu-central-1.amazonaws.com/different.dev/D9JsIaF-Tg-RS9AWsCbsEQ-0000000000:w=1280&h=1061",
      ],
    },
  },
];

const OrdersRoute = () => {
  return (
    <div className="mt-6 px-4">
      <div className="flex w-fit border border-b-0 text-xl font-bold">
        <h1 className="border-r px-7 py-4 text-main">Продажі</h1>
        <h1 className="px-7 py-4">Покупки</h1>
      </div>

      <TableContainer>
        <Table
          sx={{ minWidth: 650 }}
          className="border px-10"
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold">Оголошення</TableCell>
              <TableCell className="font-semibold">Статус</TableCell>
              <TableCell className="font-semibold">Номер накладної</TableCell>
              <TableCell className="font-semibold">Покупець</TableCell>
              <TableCell className="font-semibold">Ціна</TableCell>
              <TableCell className="font-semibold">Телефон покупця</TableCell>
              <TableCell className="font-semibold">Дата створення</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  className="underline decoration-main decoration-2 underline-offset-[5px]"
                  component="th"
                  scope="row"
                >
                  <Link to={`/listing/${row.listing.id}`}>
                    {row.listing.title}
                  </Link>
                </TableCell>
                <TableCell className={`${row.color}`}>{row.status}</TableCell>
                <TableCell>{row.trackingNumber}</TableCell>
                <TableCell className="underline decoration-main decoration-2 underline-offset-[5px]">
                  <Link to={`/${row.buyer.nickname}`}>
                    {row.buyer.nickname}
                  </Link>
                </TableCell>
                <TableCell>{row.listing.price} грн</TableCell>
                <TableCell>380965134969</TableCell>
                <TableCell>
                  {new Date(row.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
export default OrdersRoute;
