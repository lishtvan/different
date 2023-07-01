import type { LoaderFunction } from "@remix-run/node";
import { useEffect, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import ErrorBoundaryComponent from "~/components/platform/ErrorBoundary";
import { fetcher } from "~/fetcher.server";
import BuyerHint from "~/components/order/BuyerHint";

interface SellOrder {
  id: string;
  status: "SHIPPING" | "HANDLING" | "PAYMENT";
  createdAt: string;
  trackingNumber: string;
  buyer: { nickname: string; phone: string };
  listing: { price: number; title: string; id: number };
}

interface BuyOrder {
  id: string;
  status: "SHIPPING" | "HANDLING" | "PAYMENT";
  createdAt: string;
  trackingNumber: string;
  listing: {
    price: number;
    title: string;
    id: number;
    phone: string;
    User: { nickname: string };
  };
}

interface Orders {
  sellOrders: SellOrder[];
  buyOrders: BuyOrder[];
}

const STATUS_FORMAT = {
  SHIPPING: {
    color: "text-blue-500",
    statusTranslation: "Товар в дорозі",
  },
  HANDLING: {
    statusTranslation: "Очікування на відправку",
    color: "text-yellow-500",
  },
  PAYMENT: {
    statusTranslation: "Очікування на оплату",
    color: "text-orange-600",
  },
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const response = await fetcher({
    request,
    method: "POST",
    route: "/order/getMany",
  });
  return response;
};

const SellTable: FC<{ sellOrders: SellOrder[] }> = ({ sellOrders }) => {
  return (
    <Table sx={{ minWidth: 650 }} className="border" aria-label="simple table">
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
        {sellOrders.map((row) => (
          <TableRow
            key={row.id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell
              className="underline decoration-main decoration-2 underline-offset-[5px]"
              component="th"
              scope="row"
            >
              <Link to={`/listing/${row.listing.id}`}>{row.listing.title}</Link>
            </TableCell>
            <TableCell className={`${STATUS_FORMAT[row.status].color}`}>
              {STATUS_FORMAT[row.status].statusTranslation}
            </TableCell>
            <TableCell>{row.trackingNumber}</TableCell>
            <TableCell className="underline decoration-main decoration-2 underline-offset-[5px]">
              <Link to={`/${row.buyer.nickname}`}>{row.buyer.nickname}</Link>
            </TableCell>
            <TableCell>{row.listing.price} грн</TableCell>
            <TableCell>{row.buyer.phone}</TableCell>
            <TableCell>
              {new Date(row.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const BuyTable: FC<{ buyOrders: BuyOrder[] }> = ({ buyOrders }) => {
  return (
    <Table sx={{ minWidth: 650 }} className="border" aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell className="font-semibold">Оголошення</TableCell>
          <TableCell className="font-semibold">Статус</TableCell>
          <TableCell className="font-semibold">Номер накладної</TableCell>
          <TableCell className="font-semibold">Продавець</TableCell>
          <TableCell className="font-semibold">Ціна</TableCell>
          <TableCell className="font-semibold">Телефон продавця</TableCell>
          <TableCell className="font-semibold">Дата створення</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {buyOrders.map((row) => (
          <TableRow
            key={row.id}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell
              className="underline decoration-main decoration-2 underline-offset-[5px]"
              component="th"
              scope="row"
            >
              <Link to={`/listing/${row.listing.id}`}>{row.listing.title}</Link>
            </TableCell>
            <TableCell className={`${STATUS_FORMAT[row.status].color}`}>
              {STATUS_FORMAT[row.status].statusTranslation}
            </TableCell>
            <TableCell>{row.trackingNumber}</TableCell>
            <TableCell className="underline decoration-main decoration-2 underline-offset-[5px]">
              <Link to={`/${row.listing.User.nickname}`}>
                {row.listing.User.nickname}
              </Link>
            </TableCell>
            <TableCell>{row.listing.price} грн</TableCell>
            <TableCell>{row.listing.phone}</TableCell>
            <TableCell>
              {new Date(row.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const OrdersRoute = () => {
  const loaderData = useLoaderData<Orders>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const { buyOrders, sellOrders } = loaderData;
    const currentTab = searchParams.get("q");
    if (currentTab) return;
    if (buyOrders.length > sellOrders.length) {
      setSearchParams("?q=buy");
    } else setSearchParams("q=sell");
  }, [loaderData, searchParams]);

  return (
    <div className="mt-6 px-4 2xl:px-32">
      {searchParams.get("hint") && <BuyerHint />}
      <div className="flex w-fit border border-b-0 text-xl font-bold">
        <button
          onClick={() => setSearchParams("?q=sell")}
          className={`border-r px-7 py-4 ${
            searchParams.get("q") === "sell" ? "text-main" : "hover:text-main"
          }`}
        >
          Продажі
        </button>
        <button
          onClick={() => setSearchParams("?q=buy")}
          className={`px-7 py-4 ${
            searchParams.get("q") !== "sell" ? "text-main" : "hover:text-main"
          }`}
        >
          Покупки
        </button>
      </div>

      {searchParams.get("q") === "sell" ? (
        <TableContainer>
          <SellTable sellOrders={loaderData?.sellOrders} />
        </TableContainer>
      ) : (
        <TableContainer>
          <BuyTable buyOrders={loaderData?.buyOrders} />
        </TableContainer>
      )}
    </div>
  );
};

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
export default OrdersRoute;
