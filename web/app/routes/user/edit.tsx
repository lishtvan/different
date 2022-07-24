import { Button, IconButton, TextField, Tooltip } from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { S3_URL } from "~/constants/s3";
import { getCookieValue } from "~/utils/cookie";
import { fetchInstance } from "~/utils/fetchInstance";
import ProfileImage from "./../../assets/profile.jpeg";
import { getErrors } from "~/utils/getErrors";
import type { FormEvent } from "react";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = getCookieValue("userId", request);

  const response = await fetchInstance({
    request,
    method: "POST",
    body: JSON.stringify({
      userId,
    }),
    route: "/user/get",
  });
  return response;
};

export const action: ActionFunction = async ({ request }) => {
  const userId = getCookieValue("userId", request);
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 500_000,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const body = Object.fromEntries(formData);

  const { _action, avatarKeyToDelete, bio, nickname } = body;

  if (_action === "deleteImage") {
    await fetchInstance({
      request,
      route: "/user/update",
      method: "POST",
      body: JSON.stringify({
        avatarKey: null,
      }),
    });
    await fetchInstance({
      request,
      route: "/image/delete",
      method: "POST",
      body: JSON.stringify({
        imageKey: avatarKeyToDelete,
      }),
    });
    return null;
  }
  if (_action === "save") {
    const { imageKey } = await fetchInstance({
      request,
      route: "/image/upload",
      method: "POST",
      contentType: "multipart/form-data",
      body: formData,
    }).then((res) => res.json());
    const response = await fetchInstance({
      request,
      route: "/user/update",
      method: "POST",
      body: JSON.stringify({
        bio,
        avatarKey: imageKey,
        nickname,
      }),
    });
    if (response.status === 400) {
      const { message } = await response.json();
      const errors = getErrors(message);
      return { errors };
    }
    return redirect(`/user/${userId}`);
  }
  const { imageKey } = await fetchInstance({
    request,
    route: "/image/upload",
    method: "POST",
    contentType: "multipart/form-data",
    body: formData,
  }).then((res) => res.json());
  await fetchInstance({
    request,
    route: "/user/update",
    method: "POST",
    body: JSON.stringify({
      bio,
      avatarKey: imageKey,
      nickname,
    }),
  });
  return { imageKey };
};

const UserEditRoute = () => {
  const { name, nickname, avatarKey, bio } = useLoaderData();
  const data = useActionData();
  const submit = useSubmit();
  const { location, state, type, submission } = useTransition();
  console.log({ location, state, type, submission });

  const handleChange = (e: FormEvent<HTMLFormElement>) => {
    submit(e.currentTarget, { replace: true });
  };

  return (
    <Form
      method="post"
      className="flex mt-6 mx-auto justify-center items-center flex-col w-96"
      action=""
      encType="multipart/form-data"
      onChange={handleChange}
    >
      <div className="flex relative justify-center items-center w-full">
        <label className="profile" htmlFor="button-file">
          <img
            src={
              (data?.imageKey && `${S3_URL}/${data?.imageKey}`) ||
              (avatarKey && `${S3_URL}/${avatarKey}`) ||
              ProfileImage
            }
            alt="avatar"
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
        </label>

        <div className="absolute ml-56">
          <input hidden name="avatarKeyToDelete" defaultValue={avatarKey} />
          <Tooltip title="Delete">
            <IconButton
              type="submit"
              name="_action"
              value="deleteImage"
              size="large"
              color="inherit"
              aria-label="delete"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <TextField
        error={Boolean(data?.errors?.nickname)}
        label={data?.errors?.nickname}
        placeholder="Nickname"
        name="nickname"
        sx={{ marginTop: "15px", width: "100%" }}
        defaultValue={nickname || name}
      />
      <TextField
        error={Boolean(data?.errors?.bio)}
        label={data?.errors?.bio}
        rows={3}
        multiline
        name="bio"
        defaultValue={bio}
        sx={{ marginTop: "15px", marginBottom: "15px", width: "100%" }}
        placeholder="Bio"
      />
      <TextField
        placeholder="Location"
        name="location"
        sx={{ marginBottom: "15px", width: "100%" }}
      />
      <Button
        type="submit"
        name="_action"
        value="save"
        sx={{ marginTop: "20px", marginBottom: "20px", width: "100%" }}
        variant="contained"
      >
        {submission ? "Saving..." : "Save"}
      </Button>
    </Form>
  );
};

export default UserEditRoute;
