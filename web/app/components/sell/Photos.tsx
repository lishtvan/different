import { IconButton, ImageList, ImageListItem, Tooltip } from "@mui/material";
import type { DragEvent, FormEvent } from "react";
import { useState, useEffect } from "react";
import { AddAPhoto, Close, ErrorOutline, Search } from "@mui/icons-material";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { S3_URL } from "~/constants/s3";

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

interface Image {
  imageKey: string | null;
  id: number;
}

const Photos = () => {
  const submit = useSubmit();
  const actionData = useActionData();
  const [cardList, setCardList] = useState<Image[]>(initialImageList);
  const [currentCard, setCurrentCard] = useState<null | Image>(null);

  useEffect(() => {
    if (!actionData?.imageKey) return;
    const { imageId, imageKey } = actionData;
    const newCards = [...cardList];
    newCards[actionData.imageId] = {
      id: imageId,
      imageKey,
    };
    setCardList(newCards);
  }, [actionData]);

  const dragStartHandler = (card: Image) => {
    setCurrentCard(card);
  };

  const dropHandler = (e: DragEvent<HTMLDivElement>, card: Image) => {
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

  const handleChange = (e: FormEvent<HTMLFormElement>) => {
    submit(e.currentTarget, { replace: true });
  };

  return (
    <div className="w-full flex justify-center">
      <ImageList sx={{ width: 774 }} variant="quilted" cols={6} rowHeight={140}>
        {cardList.map((item) => (
          <ImageListItem
            key={item.id}
            cols={item.id === 0 ? 3 : undefined}
            rows={item.id === 0 ? 3 : undefined}
          >
            {item.imageKey ? (
              <div
                className="h-full relative"
                draggable={true}
                onDragStart={() => dragStartHandler(item)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => dropHandler(e, item)}
              >
                <div className="absolute top-1 right-1 flex">
                  <Tooltip title="Mark as deffect">
                    <IconButton
                      size="small"
                      className="text-white backdrop-brightness-50 bg-white/30 mr-1"
                    >
                      <ErrorOutline />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    size="small"
                    className="text-white backdrop-brightness-50 bg-white/30"
                  >
                    <Close />
                  </IconButton>
                </div>
                <div className="absolute top-1 left-3">
                  <IconButton
                    size="small"
                    className="text-white backdrop-brightness-50 bg-white/30"
                  >
                    <Search />
                  </IconButton>
                </div>
                <img
                  src={item.imageKey}
                  alt={"Item"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <Form
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
              </Form>
            )}
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default Photos;
