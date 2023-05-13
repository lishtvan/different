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
  Tags,
} from "~/components/sell";
import { fetcher } from "~/fetcher.server";
import { getBody } from "~/utils/getBody";
import { getErrors } from "~/utils/getErrors";
import { s3UploaderHandler } from "~/s3.server";
import { useTranslation } from "react-i18next";
import ErrorBoundaryComponent from "~/components/platform/ErrorBoundary";

export const action: ActionFunction = async ({ request, params }) => {
  const contentType = request.headers.get("Content-type");
  const { listingId } = params;

  if (contentType === "application/x-www-form-urlencoded;charset=UTF-8") {
    const form = await request.formData();
    const body = getBody(form);
    let formattedTags = [];
    // @ts-ignore
    if (body.tags) formattedTags = body.tags.split(",");

    const response = await fetcher({
      request,
      route: "/listing/update",
      method: "POST",
      body: {
        ...body,
        tags: formattedTags,
        listingId: Number(listingId),
      },
    });
    if (response.headers.get("location")) return null;
    if (response.status === 400) {
      const { message } = await response.json();

      const errors = getErrors(message);
      return { errors };
    }

    return redirect(`/listing/${listingId}`);
  }

  const form = await unstable_parseMultipartFormData(
    request,
    s3UploaderHandler
  );
  const imageKeys = form.getAll("images");
  return { imageKeys };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const listingId = Number(params.listingId);

  const { listing, isOwnListing } = await fetcher({
    request,
    route: "/listing/get",
    method: "POST",
    body: { listingId },
  }).then((res) => res.json());

  if (!isOwnListing) throw new Response("", { status: 404 });
  return listing;
};

const EditListingRoute = () => {
  const actionData = useActionData();
  const { t } = useTranslation();

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
    <div className="mx-auto mb-36 mt-6 flex flex-col items-center justify-center lg:w-[950px]">
      <h1 className="text-3xl font-semibold">{t("Edit listing")}</h1>
      <Form
        method="post"
        className="mt-6 grid w-full grid-cols-2 gap-x-8 gap-y-6"
        onSubmit={() => window.scrollTo({ top: 0, left: 0 })}
      >
        <ItemTitle />
        <Designer />
        <SelectCategory />
        <Photos />
        <Description />
        <Condition />
        <Tags />
        <Price />
        <ClientOnly fallback={<p>Loading...</p>}>
          {() => <CardNumber />}
        </ClientOnly>
        <Button
          variant="contained"
          className="col-start-1 col-end-3 mx-auto mt-12 w-1/3"
          type="submit"
        >
          {t("Save")}
        </Button>
      </Form>
    </div>
  );
};

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
export default EditListingRoute;
