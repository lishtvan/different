import { Button } from "@mui/material";
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { ClientOnly } from "remix-utils";
import {
  CardNumber,
  Condition,
  Description,
  Designer,
  ItemTitle,
  Price,
  SelectCategory,
  Shipping,
  Tags,
} from "~/components/sell";
import { fetchInstance } from "~/utils/fetchInstance";
import { getBody } from "~/utils/getBody";
import { getErrors } from "~/utils/getErrors";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const shipping = form.getAll("shipping");
  const formEntries = Object.fromEntries(form);
  const body = getBody(formEntries);
  if (body.size === "false") delete body.size;

  const response = await fetchInstance({
    request,
    route: "/listing/create",
    method: "POST",
    body: {
      ...body,
      shipping,
    },
  });
  if (response.status === 400) {
    const { message } = await response.json();

    const errors = getErrors(message);
    return { errors };
  }
  return response;
};

const SellRoute = () => {
  const data = useActionData();

  return (
    <div className="flex mt-6 mb-36 justify-center items-center flex-col">
      <div className="text-3xl mb-6 font-semibold">Create a new listing</div>
      <Form method="post" className="w-1/3">
        <ItemTitle error={data?.errors?.title} />
        <div className="mt-6">
          <SelectCategory
            sizeError={data?.errors?.size}
            categoryError={data?.errors?.category}
          />
        </div>
        <div className="mt-6">
          <Designer error={data?.errors?.designer} />
        </div>
        <div className="mt-6">
          <Description />
        </div>
        <div className="mt-6">
          <Condition error={data?.errors?.condition} />
        </div>
        <div className="mt-6">
          <Tags />
        </div>
        <div className="mt-6">
          <Price error={data?.errors?.price} />
        </div>
        <div className="mt-6">
          <ClientOnly fallback={<p>Loading...</p>}>
            {() => <CardNumber error={data?.errors?.cardNumber} />}
          </ClientOnly>
        </div>
        <div className="mt-6">
          <Shipping error={data?.errors?.shipping} />
        </div>
        <Button variant="contained" className="mt-12 mx-auto" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default SellRoute;
