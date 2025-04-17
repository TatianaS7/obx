import React, { useState, useEffect } from "react";
import { ApiProvider, useApi } from "../api/ApiContext";

// Import Components
import Home from "../pages/Home";
import OilSelection from "./OilSelection";

function App() {
  // const { browseOils } = useApi();
  const [browseOils, setBrowseOils] = useState(false);

  return (
    <main>
      <ApiProvider>
        <Home browseOils={browseOils} setBrowseOils={setBrowseOils} />
        {browseOils && <OilSelection />}
      </ApiProvider>
    </main>
  );
}

export default App;
