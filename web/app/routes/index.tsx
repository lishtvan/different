import { Tooltip } from "@mui/material";
import { Link } from "@remix-run/react";
import Filters from "~/components/Filters";

const items = [
  {
    imageKey:
      "https://different-s3-bucket.s3.amazonaws.com/XVOF19DZQHytYDKBr6F4mQ-9",
    designer: "Takahiromiyashita The Soloist.",
    description:
      "Bape bapesta hoodie black&grey Bape bapesta hoodie black grey",
    price: "250$",
  },
  {
    imageKey:
      "https://different-s3-bucket.s3.us-east-1.amazonaws.com/U1echujASJyyWpE2XSnsbA-19",
    designer: "Woolrich John Rich & Bros.",
    description: "Bape bapesta hoodie black&grey",
    price: "250$",
  },
  {
    imageKey:
      "https://different-s3-bucket.s3.amazonaws.com/U1echujASJyyWpE2XSnsbA-20",
    designer: "Ben Taverniti Unravel Project",
    description: "Bape bapesta hoodie black&grey",
    price: "250$",
  },
  {
    imageKey:
      "https://different-s3-bucket.s3.amazonaws.com/U1echujASJyyWpE2XSnsbA-5",
    designer: "United Colors Of Benetton",
    description: "Bape bapesta hoodie black&grey",
    price: "250$",
  },
  {
    imageKey:
      "https://different-s3-bucket.s3.amazonaws.com/XVOF19DZQHytYDKBr6F4mQ-14",
    designer: "BAPE",
    description: "Bape bapesta hoodie black&grey",
    price: "250$",
  },
  {
    imageKey:
      "https://different-s3-bucket.s3.amazonaws.com/wlyradGWR1aK4YhH8re1QA-20",
    designer: "BAPE",
    description: "Bape bapesta hoodie black&grey",
    price: "250$",
  },
  {
    imageKey:
      "https://different-s3-bucket.s3.amazonaws.com/Nf6TPygMTcqiSjgHuUD_qQ-95",
    designer: "BAPE",
    description: "Bape bapesta hoodie black&grey",
    price: "250$",
  },
  {
    imageKey:
      "https://different-s3-bucket.s3.amazonaws.com/wlyradGWR1aK4YhH8re1QA-0",
    designer: "BAPE",
    description: "Bape bapesta hoodie black&grey",
    price: "250$",
  },
  {
    imageKey:
      "https://different-s3-bucket.s3.amazonaws.com/Nf6TPygMTcqiSjgHuUD_qQ-96",
    designer: "BAPE",
    description: "Bape bapesta hoodie black&grey",
    price: "250$",
  },
];

export default function Index() {
  return (
    <div className="mt-2 flex h-5/6">
      <Filters />
      <div className="lg:grid-cols-4 md:grid-cols-3 grid-cols-2 mb-8 ml-4 w-full grid gap-x-[1.125rem] gap-y-4">
        {items.map((item, index) => (
          <Link to="/sell/2" key={index}>
            <div className="h-fit border rounded-md" key={index}>
              <img
                className="w-full aspect-[9.4/10] rounded-t-md object-cover"
                src={`${item.imageKey}`}
                loading="lazy"
                alt="item"
              />
              <div className="px-2 w-full max-w-full">
                <div className="mt-3 flex overflow-hidden justify-between">
                  <div className="text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis flex-shrink-0 max-w-[170px] md:max-w-[130px] 2xl:max-w-full lg:max-w-[140px] xl:max-w-[190px]">
                    {item.designer}
                  </div>
                  <div className="text-sm">M</div>
                </div>
                <Tooltip
                  disableInteractive
                  title={<p className="text-sm">{item.description}</p>}
                >
                  <div className="text-sm mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.description}
                  </div>
                </Tooltip>

                <div className="text-sm font-bold my-2">250$</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
