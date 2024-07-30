import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Different" },
    {
      name: "description",
      content: "Маркетплейс для одягу, взуття та аксесуарів",
    },
  ];
};

export default function Index() {
  return (
    <div className="h-screen container flex justify-center items-center ">
      <p className="text-center text-muted-foreground  text-xs xs:text-base sm:text-lg">
        Веб версія припинила своє існування.
        <br /> Мобільний додаток для IOS та Android.
        <br /> Coming soon...
      </p>
    </div>
  );

  // return (
  //   <div className="h-screen container px-2 sm:px-2 flex items-center justify-center">
  //     <div className="flex items-center justify-center gap-x-20 sm:gap-x-8 md:gap-x-8 lg:gap-x-32 xl:gap-x-40">
  //       <div className="flex flex-col max-w-[450px]">
  //         <h1 className="mx-auto max-w-[300px] text-center text-base font-bold leading-tight tracking-tighter md:text-2xl lg:leading-[1.1] sm:text-start sm:max-w-full sm:mx-0">
  //           Different - маркетплейс для одягу, взуття та аксесуарів
  //         </h1>
  //         <p className="text-center mt-3 text-sm text-muted-foreground lg:text-xl md:text-base sm:text-sm sm:text-start">
  //           Швидкий, зручний, сучасний додаток для IOS та Android. Захищеність
  //           покупців та продавців. Гнучкі фільтри пошуку, чат, трекінг
  //           замовлення та багато іншого.
  //         </p>
  //         <div className="flex items-center mt-10 gap-x-3 flex-row justify-center sm:justify-start">
  //           <Icons.appStore className="max-w-full" />
  //           <Icons.googlePlay className="max-w-full" />
  //         </div>
  //       </div>
  //       <div className="hidden sm:block sm:w-[220px] md:w-1/3 lg:w-[22%] xl:w-1/5">
  //         <img
  //           className="w-full"
  //           src={ios}
  //           width={300}
  //           height={612}
  //           alt="phone"
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );
}
