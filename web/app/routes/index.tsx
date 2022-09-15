import { Tooltip } from "@mui/material";
import { Link } from "@remix-run/react";
import { useHits } from "react-instantsearch-hooks-web";
import Filters from "~/components/Filters";
import { SHORT_SIZES } from "~/constants/listing";

const Hit = ({ hit }: { hit: any }) => {
  return (
    <Link to="/sell/2">
      <div className="h-fit border rounded-md">
        <img
          className="w-full aspect-[9.4/10] rounded-t-md object-cover"
          src={`${hit.imageUrls[0]}`}
          loading="lazy"
          alt="item"
        />
        <div className="px-2">
          <div className="mt-3 flex overflow-hidden justify-between">
            <div className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px] md:max-w-[130px] 2xl:max-w-full lg:max-w-[135px] xl:max-w-[185px]">
              {hit.designer}
            </div>
            <div className="text-sm whitespace-nowrap text-ellipsis overflow-hidden">
              {/* @ts-ignore */}
              {SHORT_SIZES[hit.size]}
            </div>
          </div>
          <Tooltip
            disableInteractive
            title={<p className="text-sm">{hit.title}</p>}
          >
            <div className="text-sm mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
              {hit.title}
            </div>
          </Tooltip>
          <div className="text-sm font-bold my-2">{hit.price} ₴</div>
        </div>
      </div>
    </Link>
  );
};

const Listings = () => {
  const { hits } = useHits();

  return (
    <div className="lg:grid-cols-4 md:grid-cols-3 grid-cols-2 mb-8 ml-4 w-full grid gap-x-[1.125rem] gap-y-4">
      {hits.map((hit: any) => (
        <Hit hit={hit} key={hit.objectID} />
      ))}
    </div>
  );
};

export default function Index() {
  return (
    <div className="mt-2 flex h-5/6">
      <Filters />
      <Listings />
    </div>
  );
}
