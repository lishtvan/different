import {
  Button,
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import type { DragEvent, FormEvent } from "react";
import { useState, useEffect } from "react";
import {
  AddAPhoto,
  PhotoCamera,
  Close,
  Search,
  Delete,
} from "@mui/icons-material";
import { Form, useActionData, useFetcher } from "@remix-run/react";

import { Gallery, Item } from "react-photoswipe-gallery";
import FieldTitle from "./FieldTitle";

interface ItemImage {
  imageKey: string | null;
  id: number;
  height?: number;
  width?: number;
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
  const [imageLoading, setImageLoading] = useState<number | boolean>(false);
  const imageLoadingId = Number(fetcher.submission?.formData.get("imageId"));
  const imagesLoading = fetcher.submission?.formData.get("images");

  useEffect(() => {
    const asyncEffect = async () => {
      if (!fetcher.data?.imageKeys) return;
      const { imageKeys } = fetcher.data;
      const promises = imageKeys.map((imageKey: string, index: number) => {
        const p = new Promise((resolve) => {
          const img = new Image();
          img.src = imageKey;
          img.onload = () => {
            resolve({
              id: index,
              imageKey,
              height: img.height,
              width: img.width,
            });
          };
        });
        return p;
      });

      const images = await Promise.all(promises);
      const newCards = [...cardList];
      const cardsWithoutImageLengh = cardList.filter(
        (card) => !card.imageKey
      ).length;

      const slicedImages = images.slice(0, cardsWithoutImageLengh);
      slicedImages.forEach((image) => {
        let index = image.id;
        const assignImage = () => {
          if (newCards[index].imageKey) {
            index += 1;
            assignImage();
          } else
            newCards[index] = {
              ...image,
              id: index,
            };
        };
        assignImage();
      });
      setCardList(newCards);
    };
    asyncEffect();
  }, [fetcher.data?.imageKeys]);

  useEffect(() => {
    if (!fetcher.data?.imageKey) return;
    const { imageId, imageKey } = fetcher.data;
    setImageLoading(imageId);
    const newCards = [...cardList];
    const img = new Image();
    img.src = imageKey;
    img.onload = () => {
      newCards[imageId] = {
        id: imageId,
        imageKey,
        height: img.height,
        width: img.width,
      };
      setCardList(newCards);
      setImageLoading(false);
    };
  }, [fetcher.data]);

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
            width: currentCard.width,
            height: currentCard.height,
          };
        if (c.id === currentCard.id)
          return {
            ...c,
            imageKey: card.imageKey,
            width: card.width,
            height: card.height,
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
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex items-center"
        onChange={handleChange}
      >
        <p className="ml-2 mr-auto">
          Note: You can change order of images by grabbing them.
        </p>
        <Button
          variant="outlined"
          endIcon={<Delete />}
          className="mr-2 text-black"
          onClick={deleteAllHandler}
        >
          Delete all
        </Button>
        <Button
          variant="contained"
          endIcon={!imagesLoading && <PhotoCamera />}
          component="label"
        >
          {imagesLoading ? "Uploading..." : "Upload all"}
          {imagesLoading && (
            <CircularProgress className="text-white ml-2 w-6 h-6" />
          )}
          <input
            name="images"
            hidden
            accept="image/*"
            disabled={Boolean(imagesLoading)}
            multiple
            type="file"
          />
        </Button>
      </Form>
      <div className="w-full mt-3 flex justify-center">
        <Gallery>
          <ImageList
            className="w-full"
            variant="quilted"
            cols={6}
            rowHeight={140}
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
                      width={item.width}
                      height={item.height}
                    >
                      {({ ref, open }) => (
                        <>
                          <div className="absolute top-1 left-3">
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
                            // @ts-ignore
                            src={item.imageKey}
                            alt={"Item"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </>
                      )}
                    </Item>
                  </div>
                ) : (imageLoadingId === item.id && !imagesLoading) ||
                  imageLoading === item.id ? (
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
                      <input hidden readOnly name="imageId" value={item.id} />
                      <input
                        disabled={Boolean(fetcher.submission)}
                        name={"image"}
                        id={item.id.toString()}
                        accept="image/*"
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
