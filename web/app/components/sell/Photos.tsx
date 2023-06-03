import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import type { DragEvent, FormEvent } from "react";
import { useState, useEffect } from "react";
import { AddAPhoto, Close, Search, Delete } from "@mui/icons-material";
import { useActionData, useFetcher, useLoaderData } from "@remix-run/react";

import { Gallery, Item } from "react-photoswipe-gallery";
import FieldTitle from "./FieldTitle";
import { useTranslation } from "react-i18next";

interface ItemImage {
  imageKey: string | null;
  id: number;
}

const initialImageList: ItemImage[] = [
  { id: 0, imageKey: null },
  { id: 1, imageKey: null },
  { id: 2, imageKey: null },
  { id: 3, imageKey: null },
  { id: 4, imageKey: null },
  { id: 5, imageKey: null },
  { id: 6, imageKey: null },
  { id: 7, imageKey: null },
  { id: 8, imageKey: null },
  { id: 9, imageKey: null },
];

const Photos = () => {
  const { t } = useTranslation();
  const loaderData = useLoaderData();
  const [cardList, setCardList] = useState<ItemImage[]>(initialImageList);
  const [currentCard, setCurrentCard] = useState<null | ItemImage>(null);
  const fetcher = useFetcher();
  const actionData = useActionData();
  const [imagesLoading, setImageLoading] = useState<number[]>([]);
  const [uploadError, setUploadError] = useState<boolean | string>(false);

  const getImageDimensions = (imageKey: string, dimension: "h" | "w") => {
    const stringArr = imageKey.split(":");
    const resolutionStr = stringArr[stringArr.length - 1];
    const dimensionValue = new URLSearchParams(resolutionStr).get(dimension);
    return Number(dimensionValue);
  };

  useEffect(() => {
    if (!loaderData?.imageUrls) return;
    if (cardList.some((item) => item.imageKey)) return;
    const editImages = [];
    for (let index = 0; index < 10; index++) {
      editImages.push({
        id: index,
        imageKey: loaderData.imageUrls[index] || null,
      });
    }
    setCardList(editImages);
  }, [loaderData.imageUrls]);

  useEffect(() => {
    if (!fetcher.data?.imageKeys) return;
    const { imageKeys } = fetcher.data;

    const newCards: ItemImage[] = [];
    let counter = 0;
    cardList.forEach((card) => {
      if (card.imageKey) {
        newCards.push(card);
        return;
      }
      const imageKey = imageKeys[counter];
      if (!imagesLoading.includes(card.id)) {
        newCards.push({ id: card.id, imageKey: null });
      } else {
        newCards.push({ id: card.id, imageKey });
        counter++;
      }
    });
    setImageLoading([]);
    setCardList(newCards);
  }, [fetcher.data?.imageKeys]);

  const dragStartHandler = (card: ItemImage) => setCurrentCard(card);

  const dropHandler = (e: DragEvent<HTMLDivElement>, card: ItemImage) => {
    e.preventDefault();
    if (!currentCard) return;
    setCardList(
      cardList.map((c) => {
        if (c.id === card.id)
          return {
            ...c,
            imageKey: currentCard.imageKey,
          };
        if (c.id === currentCard.id)
          return {
            ...c,
            imageKey: card.imageKey,
          };
        return c;
      })
    );
  };

  const handleDeleteImage = (imageId: number) => {
    const newCards = [...cardList];
    newCards[imageId] = { id: imageId, imageKey: null };
    setCardList(newCards);
  };

  const handleChange = (e: FormEvent<HTMLFormElement>) => {
    // @ts-ignore
    const files = e.target.files;
    if (!files) return;

    const emptyPositionsIds: number[] = [];
    cardList.forEach((card) => {
      if (!card.imageKey) emptyPositionsIds.push(card.id);
    });
    if (files.length > emptyPositionsIds.length) {
      setUploadError("You can upload a maximum of 10 pictures");
      return;
    }
    for (const file of files) {
      if (file.size > 7_000_000) {
        setUploadError("The size of the picture should not be more than 7MB");
        return;
      }
    }
    if (uploadError) setUploadError(false);

    fetcher.submit(e.currentTarget, { replace: true });

    if (files.length === 1) {
      // @ts-ignore
      setImageLoading([Number(e.target.id)]);
    } else if (files.length > 1) {
      const filteredEmptyPositions: number[] = [];
      emptyPositionsIds.forEach((id, index) => {
        if (index < files.length) filteredEmptyPositions.push(id);
      });
      setImageLoading(filteredEmptyPositions);
    }
  };

  const deleteAllHandler = () => {
    setCardList(initialImageList);
  };

  return (
    <div className="col-start-1 col-end-3">
      <FieldTitle required={true} title={t("Photos")} />
      {actionData?.errors?.imageUrls && (
        <p className="ml-2 mt-1 text-[#d32f2f]">
          {t(actionData.errors.imageUrls)}
        </p>
      )}
      <div className="flex items-center">
        {uploadError ? (
          <Alert
            severity="error"
            className="mx-auto w-full rounded-xl font-bold"
          >
            {t(uploadError as string)}
          </Alert>
        ) : (
          <>
            <p className="ml-2 mr-auto">
              <span className="mr-1 text-main">{t("Note")}:</span>
              {t("You can change order of images by grabbing them")}.
            </p>
            <Button
              variant="outlined"
              endIcon={<Delete />}
              className="text-black"
              onClick={deleteAllHandler}
            >
              {t("Delete all")}
            </Button>
          </>
        )}
      </div>
      <div className="mt-3 flex w-full justify-center">
        <Gallery>
          <ImageList
            className="w-full"
            variant="quilted"
            cols={6}
            rowHeight={159}
          >
            {cardList.map((item) => (
              <ImageListItem
                key={item.id}
                cols={item.id === 0 ? 3 : undefined}
                rows={item.id === 0 ? 3 : undefined}
              >
                {item.imageKey ? (
                  <div
                    className="relative h-full cursor-grab"
                    draggable={true}
                    onDragStart={() => dragStartHandler(item)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => dropHandler(e, item)}
                  >
                    <div className="absolute right-1 top-1 flex">
                      <IconButton
                        onClick={() => handleDeleteImage(item.id)}
                        size="small"
                        className="bg-white/30 text-white backdrop-brightness-50"
                      >
                        <Close />
                      </IconButton>
                    </div>
                    <input
                      hidden
                      name="imageUrls"
                      readOnly
                      value={item.imageKey}
                    />
                    <Item
                      original={item.imageKey}
                      width={getImageDimensions(item.imageKey, "w")}
                      height={getImageDimensions(item.imageKey, "h")}
                    >
                      {({ ref, open }) => (
                        <>
                          <div className="absolute left-1 top-1">
                            <IconButton
                              size="small"
                              onClick={open}
                              className="bg-white/30 text-white backdrop-brightness-50"
                            >
                              <Search />
                            </IconButton>
                          </div>
                          <img
                            // @ts-ignore
                            ref={ref}
                            src={item.imageKey!!}
                            alt={"Item"}
                            className="h-full w-full object-cover"
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src = item.imageKey!!;
                            }}
                          />
                        </>
                      )}
                    </Item>
                  </div>
                ) : imagesLoading.includes(item.id) ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <CircularProgress color="primary" />
                  </div>
                ) : (
                  <fetcher.Form
                    method="post"
                    encType="multipart/form-data"
                    className="h-full"
                    onChange={handleChange}
                  >
                    <label
                      htmlFor={item.id.toString()}
                      className={`${
                        fetcher.submission && "cursor-not-allowed"
                      } flex h-full items-center justify-center rounded-md bg-[#f2f2f2] hover:bg-[#ebebeb]`}
                    >
                      <div>
                        <AddAPhoto className="h-9 w-9" />
                      </div>
                      <input
                        disabled={Boolean(fetcher.submission)}
                        name="images"
                        id={item.id.toString()}
                        accept="image/*"
                        multiple
                        type="file"
                        hidden
                      />
                    </label>
                  </fetcher.Form>
                )}
              </ImageListItem>
            ))}
          </ImageList>
        </Gallery>
      </div>
    </div>
  );
};

export default Photos;
