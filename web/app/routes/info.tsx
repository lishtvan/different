import { Button } from "@mui/material";
import { Link, useSearchParams } from "@remix-run/react";
import { useEffect } from "react";

const InfoRoute = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("q")) setSearchParams("?q=contact");
  }, [searchParams]);

  return (
    <div className="mt-5 w-full lg:w-2/3 2xl:w-1/2 m-auto">
      <div className="flex justify-center">
        <div className="sticky top-[74px]">
          <div className="top-[74px] sticky flex flex-col gap-y-1">
            <Button
              onClick={() => setSearchParams(`?q=contact`)}
              className={`${
                searchParams.get("q") === "contact" ? "" : "text-black"
              } `}
            >
              Зв'язатися з нами
            </Button>
            <Button
              onClick={() => setSearchParams(`?q=about`)}
              className={`${
                searchParams.get("q") === "about" ? "" : "text-black"
              }`}
            >
              Про нас
            </Button>
            <Button
              onClick={() => setSearchParams(`?q=safe`)}
              className={`${
                searchParams.get("q") === "safe" ? "" : "text-black"
              }`}
            >
              Безпечне замовлення
            </Button>
            <Button
              onClick={() => setSearchParams(`?q=payment`)}
              className={`${
                searchParams.get("q") === "payment" ? "" : "text-black"
              } `}
            >
              Оплата та доставка
            </Button>
            <Button
              onClick={() => setSearchParams(`?q=privacy`)}
              className={`${
                searchParams.get("q") === "privacy" ? "" : "text-black"
              } `}
            >
              Політика конфіденційності
            </Button>
            <Button
              onClick={() => setSearchParams(`?q=terms`)}
              className={`${
                searchParams.get("q") === "terms" ? "" : "text-black"
              } `}
            >
              Офферта
            </Button>
          </div>
        </div>
        <div className="w-2/3 ml-8 mb-24 mt-[2px]">
          {searchParams.get("q") === "contact" && (
            <div className="whitespace-pre-wrap">
              <h1 className="font-semibold text-xl">Зв'язатися з нами</h1>
              <div className="mt-3">
                Ви можете зв'язатися з нами якщо у вас є будь які проблеми,
                питання чи пропозиції.
                <p className="mt-3">
                  email: hello.different.marketplace@gmail.com
                </p>
                <p>
                  telegram:{" "}
                  <a
                    className="text-blue-500 underline underline-offset-[5px]"
                    href="https://t.me/DifferentMarketplace"
                  >
                    @DifferentMarketplace
                  </a>
                </p>
              </div>
            </div>
          )}
          {searchParams.get("q") === "about" && (
            <div>
              <h1 className="font-semibold text-xl">Про нас</h1>
              <div className="mt-2">
                Different - це маркетплейс, орієнтований на дизайнерський
                секонд-хенд одяг та аксесуари. Ми прагнемо задовольнити кожного,
                хто бажає одягатися стильно та тих, в кого є потреба продати
                речі без зайвих проблем.
                <p className="mt-2 font-medium text-lg">Особливості</p>
                <p className="mt-2">
                  Different - безкоштовна платформа, вам не потрібно платити за
                  розміщення оголошень. Єдиною платною функцією являється{" "}
                  <span>
                    <Link
                      className="underline  hover:text-blue-800"
                      to="/info?q=safe"
                    >
                      Безпечне замовлення
                    </Link>
                  </span>{" "}
                  (детальніше за посиланням). Якщо Ви не хочете витрачати кошти
                  на вашу безпеку, Ви можете домовитись особисто з продавцем,
                  але з цього моменту Different не несе ніякоЇ відповідальності.
                </p>
                <p className="mt-2 font-medium text-lg">Що ми пропонуємо?</p>
                <p className="mt-2">
                  Зрозумілій інтерфейс для продавців і доступний пошук для
                  покупців. Можливість вільно продавати необмежену кількість
                  товарів і купувати речі через захищену систему. Здатність
                  аналізувати ринкову економіку за допомогою функції "Продані".
                  Зручний чат для зв'язку між продавцем та покупцем. Усе це, та
                  ще більше іншого Ви можете знайти на нашому сайті.
                </p>
              </div>
            </div>
          )}
          {searchParams.get("q") === "safe" && (
            <div>
              <h1 className="font-semibold text-xl">Безпечне замовлення</h1>
            </div>
          )}
          {searchParams.get("q") === "payment" && (
            <div>
              <h1 className="font-semibold text-xl">Оплата та доставка</h1>
            </div>
          )}
          {searchParams.get("q") === "privacy" && (
            <div>
              <h1 className="font-semibold text-xl">
                Політика конфіденційності
              </h1>
            </div>
          )}
          {searchParams.get("q") === "terms" && (
            <div>
              <h1 className="font-semibold text-xl">Офферта</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoRoute;
