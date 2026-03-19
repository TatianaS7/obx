import React, { useEffect, useState } from "react";
import OilCard from "../components/OilCard";
import { useApi } from "../api/ApiContext";
import "../styles/BrowseOils.css";

export default function BrowseOils() {
  const { allOils, fetchOils } = useApi();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOils();
  }, []);

  const filtered = allOils.filter((oil) =>
    oil.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="browse-oils-page">
      <header className="page-hero">
        <span className="page-hero-eyebrow">Our Ingredients</span>
        <h1 className="page-hero-title">Browse Oils</h1>
        <p className="page-hero-sub">
          Discover our curated collection of carrier and essential oils, each
          chosen for its unique hair and scalp benefits.
        </p>
      </header>

      <section className="browse-oils-body">
        <div className="browse-search-bar">
          <input
            type="search"
            placeholder="Search oils..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="browse-search-input"
          />
        </div>
        <div className="oil-grid">
          {filtered.map((oil) => (
            <OilCard key={oil.id} oil={oil} />
          ))}
          {filtered.length === 0 && (
            <p className="browse-empty">
              No oils found for &ldquo;{search}&rdquo;.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
