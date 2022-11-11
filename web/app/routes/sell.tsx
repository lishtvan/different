import { Button } from "@mui/material";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect } from "react";
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
import {
  getTypesenseConfig,
  LISTINGS_COLLECTION_NAME,
} from "~/constants/typesense";
import Typesense from "typesense";
import { fetchInstance } from "~/utils/fetchInstance";
import { getBody } from "~/utils/getBody";
import { getErrors } from "~/utils/getErrors";
import { s3UploaderHandler } from "~/s3.server";

export const action: ActionFunction = async ({ request }) => {
  const contentType = request.headers.get("Content-type");

  if (contentType === "application/x-www-form-urlencoded") {
    const form = await request.formData();
    const body = getBody(form);

    let formattedTags = [];
    // @ts-ignore
    if (body.tags) formattedTags = body.tags.split(",");

    const response = await fetchInstance({
      request,
      route: "/listing/create",
      method: "POST",
      body: {
        ...body,
        tags: formattedTags,
      },
    });
    if (response.status === 400) {
      const { message } = await response.json();

      const errors = getErrors(message);
      return { errors };
    }
    const listing = await response.json();
    const writeConfig = getTypesenseConfig({ isWriteConfig: true });
    const typesenseClient = new Typesense.Client(writeConfig);
    await typesenseClient
      .collections(LISTINGS_COLLECTION_NAME)
      .documents()
      .create({ ...listing, id: listing.id.toString() });

    return redirect(`listing/${listing.id}`);
  }

  console.log("Full start", new Date().getSeconds());
  const form = await unstable_parseMultipartFormData(
    request,
    s3UploaderHandler
  );
  console.log("Full end", new Date().getSeconds());
  const imageKeys = form.getAll("images");
  return { imageKeys };
};

export const loader: LoaderFunction = async ({ request }) => {
  const response = await fetchInstance({
    request,
    route: "/",
    method: "GET",
  });
  return response;
};

const SellRoute = () => {
  const actionData = useActionData();

  useEffect(() => {
    if (!actionData?.errors) return;
    const { title, designer, size, imageUrls, category } = actionData.errors;
    if (title || designer || category || size) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      return;
    }
    if (imageUrls) {
      window.scrollTo({
        top: 300,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [actionData]);

  return (
    <div className="flex mt-6 mb-36 mx-auto justify-center items-center flex-col lg:w-[950px]">
      <div className="text-3xl font-semibold">Create a new listing</div>
      <Form
        method="post"
        className="mt-6 grid grid-cols-2 gap-x-8 gap-y-6 w-full"
      >
        <ItemTitle />
        <Designer />
        <SelectCategory />
        <Photos />
        <Description />
        <div className="col-start-1 col-end-3 grid grid-cols-2 gap-8">
          <Condition />
          <Tags />
        </div>
        <Shipping />
        <div>
          <ClientOnly fallback={<p>Loading...</p>}>
            {() => <CardNumber />}
          </ClientOnly>
          <Price />
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
