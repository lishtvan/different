import {
  Button,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { getCookieValue } from "~/utils/cookie";
import { fetcher } from "~/utils/fetcher";
import ProfileImage from "./../../assets/profile.jpeg";
import { getErrors } from "~/utils/getErrors";
import type { FormEvent } from "react";
import { s3UploaderHandler } from "~/s3.server";
import { useTranslation } from "react-i18next";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = getCookieValue("userId", request);
  if (!userId) return redirect("/");
  // TODO: rewrite to auth user route
  const response = await fetcher({
    request,
    method: "POST",
    body: { userId: Number(userId) },
    route: "/user/get",
  }).then((res) => res.json());

  return response;
};

export const action: ActionFunction = async ({ request }) => {
  const contentType = request.headers.get("Content-type");

  if (contentType === "application/x-www-form-urlencoded;charset=UTF-8") {
    const formData = await request.formData();

    const body = Object.fromEntries(formData);

    const { bio, nickname, location, _action, language } = body;

    let errors: Record<string, unknown> = {};
    if (nickname.toString().length < 2) errors.nickname = "Too short";
    else if (nickname.toString().length > 20) errors.nickname = "Too long";
    else if (!/^[a-z0-9_]+$/.exec(nickname.toString())) {
      errors.nickname = "This symbol not allowed";
    }

    if (bio.toString().length > 150) errors.bio = "Too long";
    if (location.toString().length > 40) errors.location = "Too long";
    if (Object.keys(errors).length > 0) return { errors };

    if (_action === "save") {
      const response = await fetcher({
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
      const newHeaders = new Headers();
      newHeaders.append(
        "Set-Cookie",
        `lng=${language}; Path=/; expires=Thu, 01 Jan 2030 00:00:00 GMT`
      );
      return redirect(`/${nickname}`, { headers: newHeaders });
    }
    return { errors };
  } else {
    const deleteImage = (await request.clone().formData()).get("deleteImage");

    if (deleteImage) {
      await fetcher({
        request,
        route: "/user/update",
        method: "POST",
        body: { avatarUrl: null },
      });
      return null;
    } else {
      const formData = await unstable_parseMultipartFormData(
        request,
        s3UploaderHandler
      );
      const avatarUrl = formData.get("image");

      fetcher({
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
  const { nickname, avatarUrl, bio, location } = useLoaderData();
  const data = useActionData();
  const submit = useSubmit();
  const { submission } = useTransition();
  const { i18n } = useTranslation();

  const handleChange = (e: FormEvent<HTMLFormElement>) => {
    submit(e.currentTarget, { replace: true });
  };

  return (
    <div>
      <Form
        method="post"
        className="mx-auto mt-6 flex w-96 flex-col items-center justify-center"
        encType="multipart/form-data"
        onChange={handleChange}
      >
        <div className="relative flex w-full items-center justify-center">
          <label className="profile" htmlFor="button-file">
            {submission?.encType === "multipart/form-data" ? (
              <CircularProgress color="primary" />
            ) : (
              <>
                <img
                  src={data?.avatarUrl || avatarUrl || ProfileImage}
                  alt="Avatar"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = data.avatarUrl;
                  }}
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
        className="mx-auto mt-6 flex w-96 flex-col items-center justify-center"
        onChange={handleChange}
      >
        <TextField
          placeholder="Nickname"
          name="nickname"
          autoComplete="off"
          sx={{ width: "100%" }}
          error={Boolean(data?.errors?.nickname)}
          label={data?.errors?.nickname}
          inputProps={{
            maxLength: 21,
          }}
          defaultValue={nickname}
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
          autoComplete="off"
          sx={{ marginBottom: "15px", width: "100%" }}
          error={Boolean(data?.errors?.location)}
          label={data?.errors?.location}
          inputProps={{
            maxLength: 41,
          }}
          defaultValue={location}
        />
        <TextField
          select
          name="language"
          SelectProps={{
            displayEmpty: true,
            MenuProps: { disableScrollLock: true },
            renderValue: (value) =>
              typeof value === "string" ? (
                <div>Language: {value === "en" ? "English" : "Ukrainian"}</div>
              ) : (
                <div className="text-[#aaa]">Language</div>
              ),
          }}
          defaultValue={i18n.language}
          className="w-full"
        >
          <MenuItem value={"en"}>
            <ListItemIcon className="mr-2">
              <img
                alt="United States"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg"
              />
            </ListItemIcon>
            <ListItemText>English</ListItemText>
          </MenuItem>
          <MenuItem value={"uk"}>
            <ListItemIcon className="mr-2">
              <img
                alt="United States"
                src="http://purecatamphetamine.github.io/country-flag-icons/3x2/UA.svg"
              />
            </ListItemIcon>
            <ListItemText> Ukrainian</ListItemText>
          </MenuItem>
        </TextField>
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
