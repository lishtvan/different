import {
  Button,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import { useState, useEffect } from "react";
import { AddAPhoto, Close, Search, Delete } from "@mui/icons-material";
import { useActionData, useFetcher } from "@remix-run/react";

import { Gallery, Item } from "react-photoswipe-gallery";
import FieldTitle from "./FieldTitle";

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
  const [cardList, setCardList] = useState<ItemImage[]>(initialImageList);
  const [currentCard, setCurrentCard] = useState<null | ItemImage>(null);
  const fetcher = useFetcher();
  const actionData = useActionData();
  const [imagesLoading, setImageLoading] = useState<number[]>([]);

  const getImageDimensions = (imageKey: string, dimension: "h" | "w") => {
    const stringArr = imageKey.split(":");
    const resolutionStr = stringArr[stringArr.length - 1];
    const dimensionValue = new URLSearchParams(resolutionStr).get(dimension);
    return Number(dimensionValue);
  };

  useEffect(() => {
    if (!fetcher.data?.imageKeys) return;
    const { imageKeys } = fetcher.data;
    const uploadedImages: string[] = [];
    imageKeys.forEach((imageKey: string) => {
      const checkImageUpload = (imageKey: string) => {
        const image = new Image();
        image.src = imageKey;
        console.log({ complete: image.complete });
        image.onload = () => {
          uploadedImages.push(imageKey);
        };
        image.onerror = () => {
          setTimeout(() => {
            checkImageUpload(imageKey);
          }, 500);
        };
      };
      checkImageUpload(imageKey);
    });

    const interval = setInterval(() => {
      if (uploadedImages.length === imageKeys.length) {
        clearInterval(interval);
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
        console.log("end", new Date().getSeconds());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fetcher.data?.imageKeys]);

  const onImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("start", new Date().getSeconds());
    const filesLength = e.target.files?.length;
    if (filesLength === 1) {
      setImageLoading([Number(e.target.id)]);
    } else if (filesLength && filesLength > 1) {
      const emptyPositionsIds: number[] = [];
      cardList.forEach((card) => {
        if (!card.imageKey) emptyPositionsIds.push(card.id);
      });
      const filteredEmptyPositions: number[] = [];
      emptyPositionsIds.forEach((id, index) => {
        if (index < filesLength) filteredEmptyPositions.push(id);
      });
      setImageLoading(filteredEmptyPositions);
    }
  };

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
    fetcher.submit(e.currentTarget, { replace: true });
  };

  const deleteAllHandler = () => {
    setCardList(initialImageList);
  };

  return (
    <div className="col-start-1 col-end-3">
      <FieldTitle required={true} title="Photos" />
      {actionData?.errors?.imageUrls && (
        <p className="ml-2 mt-1 text-[#d32f2f]">
          {actionData.errors.imageUrls}
        </p>
      )}
      <div className="flex items-center">
        <p className="ml-2 mr-auto">
          <span className="text-main mr-1">Note:</span>
          You can change order of images by grabbing them.
        </p>
        <Button
          variant="outlined"
          endIcon={<Delete />}
          className="text-black"
          onClick={deleteAllHandler}
        >
          Delete all
        </Button>
      </div>
      <div className="w-full mt-3 flex justify-center">
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
                    className="h-full relative cursor-grab"
                    draggable={true}
                    onDragStart={() => dragStartHandler(item)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => dropHandler(e, item)}
                  >
                    <div className="absolute top-1 right-1 flex">
                      <IconButton
                        onClick={() => handleDeleteImage(item.id)}
                        size="small"
                        className="text-white backdrop-brightness-50 bg-white/30"
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
                          <div className="absolute top-1 left-1">
                            <IconButton
                              size="small"
                              onClick={open}
                              className="text-white backdrop-brightness-50 bg-white/30"
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
                          />
                        </>
                      )}
                    </Item>
                  </div>
                ) : imagesLoading.includes(item.id) ? (
                  <div className="h-full w-full flex items-center justify-center">
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
                      } h-full flex items-center justify-center rounded-md bg-[#f2f2f2] hover:bg-[#ebebeb]`}
                    >
                      <div>
                        <AddAPhoto className="w-9 h-9" />
                      </div>
                      <input
                        disabled={Boolean(fetcher.submission)}
                        name="images"
                        id={item.id.toString()}
                        accept="image/*"
                        multiple
                        onChange={onImageUpload}
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
