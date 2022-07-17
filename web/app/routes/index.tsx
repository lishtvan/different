import { useLoaderData } from "@remix-run/react";
import Filters from "~/components/Filters";
import Header from "~/components/Header";
import { getAuthorizedStatus } from "~/utils/getAuthorizedStatus";

export const loader = async ({ request }: { request: Request }) => {
  const isAuthorized = getAuthorizedStatus(request);
  return { isAuthorized };
};

export default function Index() {
  const { isAuthorized } = useLoaderData();

  return (
    <>
      <Header isAuthorized={isAuthorized} />
      <div className="mt-2 flex h-5/6">
        <Filters />
        <div className="w-4/5 ml-7 flex justify-between">
          <div className="w-56 h-fit">
            <img
              src={
                "https://gentlyusedbucket.s3.eu-central-1.amazonaws.com/Hwg2HZKzRoyGXprTxhv69w-3EE5AC22E27AC4B7D9EDB00D2AB99F27E.webp"
              }
              width={224}
              height={254}
              alt="item"
            />
            <div className="px-2">
              <div className="text-xs font-bold mt-3">BAPE</div>
              <div className="text-xs mt-3">Bape bapesta hoodie black&grey</div>
              <div className="text-xs font-bold mt-3">250$</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
