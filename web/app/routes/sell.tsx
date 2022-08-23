import { Button } from "@mui/material";
import type { ActionFunction } from "@remix-run/node";
import {
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { ClientOnly } from "remix-utils";
import {
  CardNumber,
  Condition,
  Description,
  Designer,
  ItemTitle,
  Photos,
  Price,
  SelectCategory,
  Shipping,
  Tags,
} from "~/components/sell";
import { fetchInstance } from "~/utils/fetchInstance";
import { getBody } from "~/utils/getBody";
import { getErrors } from "~/utils/getErrors";

export const action: ActionFunction = async ({ request }) => {
  const contentType = request.headers.get("Content-type");

  if (contentType === "application/x-www-form-urlencoded") {
    const form = await request.formData();
    const body = getBody(form);

    const response = await fetchInstance({
      request,
      route: "/listing/create",
      method: "POST",
      body,
    });
    if (response.status === 400) {
      const { message } = await response.json();

      const errors = getErrors(message);
      return { errors };
    }
    return response;
  }

  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 1000_000,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const images = formData.get("images");
  if (images) {
    const imageKeys = await fetchInstance({
      request,
      route: "/image/uploadMany",
      method: "POST",
      formData: true,
      body: formData,
    }).then((res) => res.json());
    return { imageKeys };
  }
  const imageId = formData.get("imageId");

  const { imageKey } = await fetchInstance({
    request,
    route: "/image/upload",
    method: "POST",
    formData: true,
    body: formData,
  }).then((res) => res.json());
  return { imageKey, imageId: Number(imageId) };
};

const SellRoute = () => {
  const data = useActionData();

  return (
    <div className="flex mt-6 mb-36 mx-auto justify-center items-center flex-col xl:w-2/3">
      <div className="text-3xl font-semibold">Create a new listing</div>
      <Form
        method="post"
        className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 w-full"
      >
        <ItemTitle error={data?.errors?.title} />
        <Designer error={data?.errors?.designer} />
        <SelectCategory
          sizeError={data?.errors?.size}
          categoryError={data?.errors?.category}
        />
        <Photos />
        <Description />
        <div className="col-start-1 col-end-3 grid grid-cols-2 gap-8">
          <Condition error={data?.errors?.condition} />
          <Tags />
        </div>
        <Shipping error={data?.errors?.shipping} />
        <div>
          <ClientOnly fallback={<p>Loading...</p>}>
            {() => <CardNumber error={data?.errors?.cardNumber} />}
          </ClientOnly>
          <Price error={data?.errors?.price} />
        </div>
        <Button
          variant="contained"
          className="col-start-1 col-end-3 mx-auto w-1/3 mt-12"
          type="submit"
        >
          Create
        </Button>
      </Form>
    </div>
  );
};

export default SellRoute;
