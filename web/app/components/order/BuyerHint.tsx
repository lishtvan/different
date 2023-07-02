import { useEffect, useState } from "react";
import { Button, Dialog } from "@mui/material";

export default function BuyerHint() {
  const [displayPopUp, setDisplayPopUp] = useState(true);

  const closePopUp = () => {
    setDisplayPopUp(false);
  };

  const closePopUpForever = () => {
    localStorage.setItem("buyerHint", "seen");
    setDisplayPopUp(false);
  };

  useEffect(() => {
    const seen = localStorage.getItem("buyerHint");
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
          <div className="w-[460px] p-5">
            Зараз Ви отримаєте push-сповіщення у мобільному додатку Нової Пошти
            про послугу Сейф-сервіс. Будь ласка, сплатіть замовлення та
            доставку. Після цього продавець має надіслати товар протягом 48
            годин. <br />
            <br />
            Якщо товар не буде відправлено – послуга Сейф-сервісу буде
            скасована, а кошти повернуться Вам в повному обсязі. <br />
            <br />
            Якщо Ви відмовитесь від товару у поштовому відділенні, кошти буде
            повернено лише за товар. Оплата послуг доставки не повертається.
            <br />
            <br />
            Замовлення та доставку потрібно сплатити упродовж 48 годин. В іншому
            разі - замовлення буде скасовано. <br />
            <br />
            Про роботу Сейф-сервісу Ви можете дізнатися детальніше за
            посиланням:
            <a
              href="https://novaposhta.ua/safeservice/"
              className="ml-2 text-blue-500 underline underline-offset-[3px]"
              target="_blank"
              rel="noreferrer"
            >
              Сейф-сервіс
            </a>
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
