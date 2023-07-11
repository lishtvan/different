import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import { useRefinementList } from "react-instantsearch-hooks-web";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { CATEGORIES } from "~/constants/listing";
import SubCategoryFilter from "./SubcategoryFilter";

interface CategoriesFilter<T> {
  Верх: T;
  Низ: T;
  "Верхній одяг": T;
  Взуття: T;
  "Офіційний одяг": T;
  Аксесуари: T;
}

const CategoryFilter = () => {
  const { items } = useRefinementList({
    attribute: "category",
  });

  const [categories, setCategories] = useState<CategoriesFilter<typeof items>>({
    Верх: [],
    Низ: [],
    "Верхній одяг": [],
    Взуття: [],
    "Офіційний одяг": [],
    Аксесуари: [],
  });

  useEffect(() => {
    const newCategories: CategoriesFilter<typeof items> = {
      Верх: [],
      Низ: [],
      "Верхній одяг": [],
      Взуття: [],
      "Офіційний одяг": [],
      Аксесуари: [],
    };
    items.forEach((item) => {
      if (CATEGORIES.Верх.includes(item.label)) newCategories.Верх.push(item);
      else if (CATEGORIES.Низ.includes(item.label)) {
        newCategories.Низ.push(item);
      } else if (CATEGORIES.Взуття.includes(item.label)) {
        newCategories.Взуття.push(item);
      } else if (CATEGORIES["Верхній одяг"].includes(item.label)) {
        newCategories["Верхній одяг"].push(item);
      } else if (CATEGORIES["Офіційний одяг"].includes(item.label)) {
        newCategories["Офіційний одяг"].push(item);
      } else if (CATEGORIES.Аксесуари.includes(item.label)) {
        newCategories.Аксесуари.push(item);
      }
    });
    setCategories(newCategories);
  }, [items]);

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItemButton onClick={handleClick} className="rounded-xl">
        <ListItemText primary={"Категорія"} />
        {open ? (
          <ArrowDropUp className="mr-1.5" />
        ) : (
          <ArrowDropDown className="mr-1.5" />
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto">
        <SubCategoryFilter subcategories={categories.Верх} category="Верх" />
        <SubCategoryFilter
          subcategories={categories.Низ}
          category="Низ"
        />
        <SubCategoryFilter
          subcategories={categories["Верхній одяг"]}
          category="Верхній одяг"
        />
        <SubCategoryFilter
          subcategories={categories.Взуття}
          category="Взуття"
        />
        <SubCategoryFilter
          subcategories={categories["Офіційний одяг"]}
          category="Офіційний одяг"
        />
        <SubCategoryFilter
          subcategories={categories.Аксесуари}
          category="Аксесуари"
        />
      </Collapse>
    </>
  );
};

export default CategoryFilter;
