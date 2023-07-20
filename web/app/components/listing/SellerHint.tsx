import { useEffect, useState } from "react";
import { Button, Dialog } from "@mui/material";

export default function SellerHint() {
  const [displayPopUp, setDisplayPopUp] = useState(true);

  const closePopUp = () => {
    setDisplayPopUp(false);
  };

  const closePopUpForever = () => {
    localStorage.setItem("sellerHint", "seen");
    setDisplayPopUp(false);
  };

  useEffect(() => {
    const seen = localStorage.getItem("sellerHint");
    setDisplayPopUp(!seen);
  }, []);

  return (
    <>
      {displayPopUp && (
        <Dialog
          open={displayPopUp}
          onClose={closePopUp}
          fullWidth={true}
          className="mx-auto flex items-center justify-center"
        >
          <div className="w-[450px] p-5">
            Після того, як покупець сплатить замовлення, Ви отримаєте
            push-сповіщення у мобільному додатку Нової Пошти про послугу
            Сейф-сервіс. Ви маєте відправити товар протягом 48 годин. <br />
            <br />
            Якщо товар не відправлено – послуга Сейф-сервісу скасовується, а
            кошти повертаються покупцю. <br />
            <br />
            Про роботу сервісу Ви можете дізнатися детальніше за посиланнями:
            <br />
            <div className="mt-2 flex">
              <a
                href="https://different-marketplace.notion.site/85d5b550e71446fcac1a0ddd697325ce"
                className="text-blue-500 underline underline-offset-[5px]"
                target="_blank"
                rel="noreferrer"
              >
                Детальна інструкція продажу
              </a>
              <a
                href="https://novaposhta.ua/safeservice/"
                className="ml-4 text-blue-500 underline underline-offset-[5px]"
                target="_blank"
                rel="noreferrer"
              >
                Сейф-сервіс
              </a>
            </div>
            <div className="mt-8 flex justify-between">
              <Button onClick={closePopUpForever} variant="outlined">
                Не показувати більше
              </Button>
              <Button onClick={closePopUp} variant="contained">
                Зрозуміло
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
}
