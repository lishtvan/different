import { IconButton, ImageList, ImageListItem } from "@mui/material";
import type { DragEvent } from "react";
import { useState } from "react";
import { Close, ErrorOutline, ZoomIn } from "@mui/icons-material";

const itemData = [
  {
    img: "https://static5.depositphotos.com/1008855/444/i/450/depositphotos_4446869-stock-photo-white-flower-background.jpg",
    id: 1,
    cols: 3,
    rows: 3,
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    id: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    id: 3,
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    id: 4,
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    id: 5,
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    id: 6,
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    id: 7,
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    id: 8,
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    id: 9,
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    id: 10,
  },
];

function srcset(image: string, size: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const Photos = () => {
  const [cardList, setCardList] = useState(itemData);
  const [currentCard, setCurrentCard] = useState<null | {
    img: string;
    id: number;
  }>(null);

  const dragStartHandler = (card: { img: string; id: number }) => {
    setCurrentCard(card);
  };

  const dropHandler = (
    e: DragEvent<HTMLDivElement>,
    card: {
      img: string;
      id: number;
    }
  ) => {
    e.preventDefault();
    if (!currentCard) return;
    setCardList(
      cardList.map((c) => {
        if (c.id === card.id) return { ...c, img: currentCard.img };
        if (c.id === currentCard.id) return { ...c, img: card.img };
        return c;
      })
    );
  };

  return (
    <div className="w-full flex justify-center">
      <ImageList sx={{ width: 774 }} variant="quilted" cols={6} rowHeight={129}>
        {cardList.map((item) => (
          <ImageListItem key={item.id} cols={item.cols} rows={item.rows}>
            <div
              className="h-full cursor-grab relative"
              draggable={true}
              onDragStart={() => dragStartHandler(item)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => dropHandler(e, item)}
            >
              <div className="absolute top-1 right-0 flex">
                <IconButton size="small" className="text-white mr-2 bg-main">
                  <ErrorOutline />
                </IconButton>
                <IconButton size="small" className="text-white bg-main">
                  <Close />
                </IconButton>
              </div>
              <div className="absolute top-1 left-2">
                <IconButton size="small" className="text-white bg-main">
                  <ZoomIn />
                </IconButton>
              </div>
              <img
                // TODO: Test with backend size
                {...srcset(item.img, 100, item.rows, item.cols)}
                alt={"Item"}
                className="h-full"
                loading="lazy"
              />
            </div>
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default Photos;
