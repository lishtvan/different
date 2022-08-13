import {
  CircularProgress,
  IconButton,
  ImageList,
  ImageListItem,
} from "@mui/material";
import type { DragEvent, FormEvent } from "react";
import { useState, useEffect } from "react";
import { AddAPhoto, Close, Search } from "@mui/icons-material";
import { useFetcher } from "@remix-run/react";

import { Gallery, Item } from "react-photoswipe-gallery";

const initialImageList = [
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

interface ItemImage {
  imageKey: string | null;
  id: number;
  height?: number;
  width?: number;
}

const Photos = () => {
  const [cardList, setCardList] = useState<ItemImage[]>(initialImageList);
  const [currentCard, setCurrentCard] = useState<null | ItemImage>(null);
  const fetcher = useFetcher();
  const [imageLoading, setImageLoading] = useState<number | boolean>(false);
  const imageLoadingId = Number(fetcher.submission?.formData.get("imageId"));

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
        if (c.id === card.id) return { ...c, imageKey: currentCard.imageKey };
        if (c.id === currentCard.id) return { ...c, imageKey: card.imageKey };
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

  return (
    <div className="w-full flex justify-center">
      <Gallery>
        <ImageList
          sx={{ width: 774 }}
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
              ) : imageLoadingId === item.id || imageLoading === item.id ? (
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
                    className="h-full flex items-center justify-center rounded-md bg-[#f2f2f2] hover:bg-[#ebebeb]"
                  >
                    <div>
                      <AddAPhoto className="w-9 h-9" />
                    </div>
                    <input hidden readOnly name="imageId" value={item.id} />
                    <input
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
  );
};

export default Photos;
