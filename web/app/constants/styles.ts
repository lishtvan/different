export const MAIN_COLOR = "#168c94";
export const DARK_COLOR = "#167994";
export const notActiveNavLinkStyle = {
  textDecoration: "underline",
  textDecorationThickness: "3px",
  textUnderlineOffset: "4px",
};

export const activeNavLinkStyle = {
  ...notActiveNavLinkStyle,
  textDecorationColor: MAIN_COLOR,
};
