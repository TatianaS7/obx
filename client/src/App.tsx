import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ApiProvider, useApi } from "./api/ApiContext";

// Import Components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BrowseOils from "./pages/BrowseOils";
import StartOrder from "./pages/StartOrder";

export default function App() {
  return (
    <main>
      <ApiProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse-oils" element={<BrowseOils />} />
            <Route path="/start-order" element={<StartOrder />} />
          </Routes>
        </Router>
      </ApiProvider>
    </main>
  );
}
