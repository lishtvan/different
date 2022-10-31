import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { getCookieValue } from "~/utils/cookie";
import { fetchInstance } from "~/utils/fetchInstance";
import ProfileImage from "./../../assets/profile.jpeg";
import { getErrors } from "~/utils/getErrors";
import type { FormEvent } from "react";
import { parseMultipartFormData, s3UploaderHandler } from "~/s3.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = getCookieValue("userId", request);
  if (!userId) return redirect("/");

  const response = await fetchInstance({
    request,
    method: "POST",
    body: { userId: Number(userId) },
    route: "/user/get",
  }).then((res) => res.json());

  // // TODO: fix not found
  if (response.statusCode === 404) return redirect("/");

  return response;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = getCookieValue("userId", request);
  const contentType = request.headers.get("Content-type");

  if (contentType === "application/x-www-form-urlencoded") {
    const formData = await request.formData();
    const body = Object.fromEntries(formData);
    const { bio, nickname, location, _action } = body;

    let errors: Record<string, unknown> = {};
    if (nickname.toString().length < 2) errors.nickname = "Too short";
    if (nickname.toString().length > 20) errors.nickname = "Too long";
    if (bio.toString().length > 150) errors.bio = "Too long";
    if (location.toString().length > 40) errors.location = "Too long";

    if (_action === "save") {
      const response = await fetchInstance({
        request,
        route: "/user/update",
        method: "POST",
        body: { bio, nickname, location },
      });
      if (response.status === 400) {
        const { message } = await response.json();
        errors = getErrors(message);
        return { errors };
      }
      return redirect(`/user/${userId}`);
    }
    return { errors };
  } else {
    const deleteImage = (await request.clone().formData()).get("deleteImage");

    if (deleteImage) {
      await fetchInstance({
        request,
        route: "/user/update",
        method: "POST",
        body: { avatarUrl: null },
      });
      return null;
    } else {
      const formData = await parseMultipartFormData(request, s3UploaderHandler);
      const avatarUrl = formData.get("image");

      fetchInstance({
        request,
        route: "/user/update",
        method: "POST",
        body: { avatarUrl },
      });
      return { avatarUrl };
    }
  }
};

const UserEditRoute = () => {
  const { name, nickname, avatarUrl, bio, location } = useLoaderData();
  const data = useActionData();
  const submit = useSubmit();
  const { submission } = useTransition();

  const handleChange = (e: FormEvent<HTMLFormElement>) => {
    submit(e.currentTarget, { replace: true });
  };

  return (
    <div>
      <Form
        method="post"
        className="flex mt-6 mx-auto justify-center items-center flex-col w-96"
        encType="multipart/form-data"
        onChange={handleChange}
      >
        <div className="flex relative justify-center items-center w-full">
          <label className="profile" htmlFor="button-file">
            {submission?.encType === "multipart/form-data" ? (
              <CircularProgress color="primary" />
            ) : (
              <>
                <img
                  src={data?.avatarUrl || avatarUrl || ProfileImage}
                  alt="Avatar"
                />
                <div className="profile__upload">
                  <button className="profile__button">
                    <PhotoCamera className="text-white" />
                  </button>
                </div>
                <input
                  name="image"
                  id="button-file"
                  accept="image/*"
                  type="file"
                  hidden
                />
              </>
            )}
          </label>
          {avatarUrl && (
            <div className="absolute ml-56">
              <Tooltip title="Delete">
                <IconButton
                  type="submit"
                  name="deleteImage"
                  value="deleteImage"
                  size="large"
                  color="inherit"
                  aria-label="delete"
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </Form>
      <Form
        method="post"
        className="flex mt-6 mx-auto justify-center items-center flex-col w-96"
        onChange={handleChange}
      >
        <TextField
          placeholder="Nickname"
          name="nickname"
          sx={{ width: "100%" }}
          error={Boolean(data?.errors?.nickname)}
          label={data?.errors?.nickname}
          inputProps={{
            maxLength: 21,
          }}
          defaultValue={nickname || name}
        />
        <TextField
          error={Boolean(data?.errors?.bio)}
          label={data?.errors?.bio}
          rows={3}
          multiline
          inputProps={{
            maxLength: 151,
          }}
          name="bio"
          defaultValue={bio}
          sx={{ marginTop: "15px", marginBottom: "15px", width: "100%" }}
          placeholder="Bio"
        />
        <TextField
          placeholder="Location"
          name="location"
          sx={{ marginBottom: "15px", width: "100%" }}
          error={Boolean(data?.errors?.location)}
          label={data?.errors?.location}
          inputProps={{
            maxLength: 41,
          }}
          defaultValue={location}
        />
        <Button
          type="submit"
          disabled={submission?.encType === "multipart/form-data"}
          name="_action"
          value="save"
          sx={{ marginTop: "20px", marginBottom: "20px", width: "100%" }}
          variant="contained"
        >
          {submission?.encType === "multipart/form-data" ||
          submission?.formData.get("_action") === "save"
            ? "Saving..."
            : "Save"}
        </Button>
      </Form>
    </div>
  );
};

export default UserEditRoute;
