import { ExpandLess, ExpandMore, Search } from "@mui/icons-material";
import {
  Checkbox,
  Collapse,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const Gender = () => {
  const genders = [
    { gender: "Male", id: 0 },
    { gender: "Female", id: 1 },
    { gender: "Unisex", id: 2 },
  ];
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const [checked, setChecked] = useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) newChecked.push(value);
    else newChecked.splice(currentIndex, 1);

    setChecked(newChecked);
  };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary="Gender" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
          }}
        >
          {genders.map(({ id, gender }) => {
            const labelId = `checkbox-list-label-${gender}`;

            return (
              <ListItem key={gender} sx={{ pl: 2 }} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(id)}
                  dense
                >
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                  <ListItemText
                    id={labelId}
                    primary={<Typography>{gender}</Typography>}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

const Designer = () => {
  const designers = [
    { designer: "Coco Chanel", id: 0 },
    { designer: "Prada", id: 1 },
    { designer: "Pierre Cardin", id: 2 },
  ];
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const [checked, setChecked] = useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) newChecked.push(value);
    else newChecked.splice(currentIndex, 1);

    setChecked(newChecked);
  };

  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ borderRadius: '0.75rem' }}>
        <ListItemText primary="Designer" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List>
          <ListItem sx={{ paddingTop: 0 }}>
            <TextField
              placeholder="Search"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton sx={{ paddingRight: 0 }}>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
          {designers.map(({ id, designer }) => {
            const labelId = `checkbox-list-label-${designer}`;

            return (
              <ListItem key={designer} sx={{ pl: 2 }} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={handleToggle(id)}
                  dense
                >
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(id) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                  <ListItemText
                    id={labelId}
                    primary={<Typography>{designer}</Typography>}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

const Filters = () => {
  return (
    <div className="w-1/5 bg-white">
      <List component="div" disablePadding>
        <Gender />
        <Designer />
      </List>
    </div>
  );
};

export default Filters;
