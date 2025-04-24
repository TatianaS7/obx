import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const [value, setValue] = useState("home");

    function handleChange(value: string) {
        setValue(value);
        if (value === "browse-oils") {
            navigate("/browse-oils");
        } else if (value === "start-order") {
            navigate("/start-order");
        } else if (value === "home") {
            navigate("/");
        }
    }

  return (
    <Tabs
      value={value}
      onChange={(event, newValue) => handleChange(newValue)}
      textColor="secondary"
      indicatorColor="secondary"
      centered
    >
      <Tab value="home" label="Home" />
      <Tab value="browse-oils" label="Browse Oils" />
      <Tab value="start-order" label="Start Order" />
    </Tabs>
  );
}
