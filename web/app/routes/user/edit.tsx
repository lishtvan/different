import {
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { PhotoCamera, Delete } from "@mui/icons-material";
import type { ActionFunction } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  useRouteLoaderData,
  useSubmit,
} from "@remix-run/react";
import { fetcher } from "~/fetcher.server";
import ProfileImage from "./../../assets/profile.jpeg";
import { getErrors } from "~/utils/getErrors";
import type { FormEvent } from "react";
import { useEffect } from "react";
import { s3UploaderHandler } from "~/s3.server";
import type { RootLoaderData } from "~/types";
import ErrorBoundaryComponent from "~/components/platform/ErrorBoundary";

export const action: ActionFunction = async ({ request }) => {
  const contentType = request.headers.get("Content-type");

  if (contentType === "application/x-www-form-urlencoded;charset=UTF-8") {
    const formData = await request.formData();

    const body = Object.fromEntries(formData);

    const { bio, nickname, location, _action } = body;

    let errors: Record<string, unknown> = {};
    if (nickname.toString().length < 2) errors.nickname = "Занадто короткий";
    else if (nickname.toString().length > 20) errors.nickname = "Занадто довгий";
    else if (!/^[a-z0-9_]+$/.exec(nickname.toString())) {
      errors.nickname = "Дозволено лише a-z, 0-9 та підкреслення";
    }

    if (bio.toString().length > 150) errors.bio = "Занадто довго";
    if (location.toString().length > 40) errors.location = "Занадто довго";
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

      return redirect(`/${nickname}`);
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
  const { user } = useRouteLoaderData("root") as RootLoaderData;
  const data = useActionData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;
    navigate("/");
  }, [user]);

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
            {navigation?.formEncType === "multipart/form-data" ? (
              <CircularProgress color="primary" />
            ) : (
              <>
                <img
                  src={data?.avatarUrl || user?.avatarUrl || ProfileImage}
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
          {user?.avatarUrl && (
            <div className="absolute ml-56">
              <Tooltip title="Видалити">
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
          placeholder="Нікнейм"
          name="nickname"
          autoComplete="off"
          sx={{ width: "100%" }}
          error={Boolean(data?.errors?.nickname)}
          label={data?.errors?.nickname}
          inputProps={{
            maxLength: 21,
          }}
          defaultValue={user?.nickname}
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
          defaultValue={user?.bio}
          sx={{ marginTop: "15px", marginBottom: "15px", width: "100%" }}
          placeholder="Про себе"
        />
        <TextField
          placeholder="Місце знаходження"
          name="location"
          autoComplete="off"
          sx={{ marginBottom: "15px", width: "100%" }}
          error={Boolean(data?.errors?.location)}
          label={data?.errors?.location}
          inputProps={{
            maxLength: 41,
          }}
          defaultValue={user?.location}
        />
        <Button
          type="submit"
          disabled={navigation?.formEncType === "multipart/form-data"}
          name="_action"
          value="save"
          sx={{ marginTop: "20px", marginBottom: "20px", width: "100%" }}
          variant="contained"
        >
          {navigation?.formEncType === "multipart/form-data" ||
          navigation?.formData?.get("_action") === "save"
            ? "Збереження..."
            : "Зберегти"}
        </Button>
      </Form>
    </div>
  );
};

export const ErrorBoundary = () => <ErrorBoundaryComponent />;
export default UserEditRoute;
