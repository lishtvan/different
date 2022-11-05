import { Collapse, ListItemButton, ListItemText } from "@mui/material";
import { useRefinementList } from "react-instantsearch-hooks-web";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { CATEGORIES } from "~/constants/listing";
import SubCategoryFilter from "./SubcategoryFilter";

interface CategoriesFilter<T> {
  Tops: T;
  Bottoms: T;
  Outerwear: T;
  Footwear: T;
  Tailoring: T;
  Accessories: T;
}

const CategoryFilter = () => {
  const { items } = useRefinementList({
    attribute: "category",
  });

  const [categories, setCategories] = useState<CategoriesFilter<typeof items>>({
    Tops: [],
    Bottoms: [],
    Outerwear: [],
    Footwear: [],
    Tailoring: [],
    Accessories: [],
  });

  useEffect(() => {
    const newCategories: CategoriesFilter<typeof items> = {
      Tops: [],
      Bottoms: [],
      Outerwear: [],
      Footwear: [],
      Tailoring: [],
      Accessories: [],
    };
    items.forEach((item) => {
      if (CATEGORIES.Tops.includes(item.label)) newCategories.Tops.push(item);
      else if (CATEGORIES.Bottoms.includes(item.label)) {
        newCategories.Bottoms.push(item);
      } else if (CATEGORIES.Footwear.includes(item.label)) {
        newCategories.Footwear.push(item);
      } else if (CATEGORIES.Outerwear.includes(item.label)) {
        newCategories.Outerwear.push(item);
      } else if (CATEGORIES.Tailoring.includes(item.label)) {
        newCategories.Tailoring.push(item);
      } else if (CATEGORIES.Accessories.includes(item.label)) {
        newCategories.Accessories.push(item);
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
        <ListItemText className="capitalize" primary={"category"} />
        {open ? (
          <ArrowDropUp className="mr-1.5" />
        ) : (
          <ArrowDropDown className="mr-1.5" />
        )}
      </ListItemButton>

      <Collapse in={open} timeout="auto">
        <SubCategoryFilter subcategories={categories.Tops} category="Tops" />
        <SubCategoryFilter
          subcategories={categories.Bottoms}
          category="Bottoms"
        />
        <SubCategoryFilter
          subcategories={categories.Outerwear}
          category="Outerwear"
        />
        <SubCategoryFilter
          subcategories={categories.Footwear}
          category="Footwear"
        />
        <SubCategoryFilter
          subcategories={categories.Tailoring}
          category="Tailoring"
        />
        <SubCategoryFilter
          subcategories={categories.Accessories}
          category="Accessories"
        />
      </Collapse>
    </>
  );
};

export default CategoryFilter;
