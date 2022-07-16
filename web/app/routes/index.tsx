import { createTheme, ThemeProvider } from "@mui/material";
import Filters from "~/components/Filters";
import Header from "~/components/Header";

// export const loader = async ({ request }: { request: Request }) => {
//   const response = await fetchInstance({
//     request,
//     method: "POST",
//     route: "/image/get",
//     headers: new Headers({
//       "Content-Type": "application/json",
//     }),
//     body: {
//       imageKey: "lj4s9eZrQsS11aMyBbggGw-0photo.jpg",
//     },
//   });
//   return response;
// };

const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
  },
});

export default function Index() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <div className="mt-2 flex h-5/6">
        <Filters />
        <div className="w-4/5 ml-7 flex justify-between">
          <div className="w-56 h-fit">
            <img
              src={
                "https://gentlyusedbucket.s3.eu-central-1.amazonaws.com/Hwg2HZKzRoyGXprTxhv69w-3EE5AC22E27AC4B7D9EDB00D2AB99F27E.webp"
              }
              width={224}
              height={254}
              alt="item"
            />
            <div className="px-2">
              <div className="text-xs font-bold mt-3">BAPE</div>
              <div className="text-xs mt-3">Bape bapesta hoodie black&grey</div>
              <div className="text-xs font-bold mt-3">250$</div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
