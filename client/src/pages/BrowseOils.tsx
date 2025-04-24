import React, { useEffect } from "react";
import OilCard from "../../../react/components/OilCard";
import { useApi } from "../api/ApiContext";
import { TextField } from "@mui/material";
import "../styles/BrowseOils.css";

export default function BrowseOils() {
  const { allOils } = useApi();
  const { fetchOils } = useApi();

  useEffect(() => {
    fetchOils();
  }, []);

  return (
    <div className="oil-selection-container">
      <div>
        <TextField
          id="search"
          label="Search Oils"
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </div>

      <div className="oil-selection">
        {allOils.map((oil) => (
          <OilCard key={oil.id} oil={oil} />
        ))}
      </div>
    </div>
  );
}
