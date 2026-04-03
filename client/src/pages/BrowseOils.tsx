import React, { useEffect, useMemo, useState } from "react";
import OilCard from "../components/catalog/OilCard";
import OilFilters from "../components/catalog/OilFilters";
import { useApi } from "../api/ApiContext";
import { OIL_TAG_LABELS } from "../types/OilTag";
import "../styles/BrowseOils.css";

interface Oil {
  id: number;
  name: string;
  description: string;
  oil_type: string | { value?: string };
  origin_country?: string | null;
  source?: string | null;
  extraction_method?: string | null;
  tags?: string[];
}

const getOilTypeValue = (oilType: Oil["oil_type"]) => {
  const raw =
    typeof oilType === "object" ? (oilType.value ?? "") : String(oilType);
  return raw.toUpperCase();
};

const getOilTypeLabel = (oilType: Oil["oil_type"]) =>
  getOilTypeValue(oilType).replace(/_/g, " ");

const SORT_LABELS: Record<string, string> = {
  NAME_ASC: "Name: A to Z",
  NAME_DESC: "Name: Z to A",
  TYPE_ASC: "Type",
  ORIGIN_ASC: "Origin",
};

export default function BrowseOils() {
  const { allOils, fetchOils } = useApi();
  const [search, setSearch] = useState("");
  const [selectedSort, setSelectedSort] = useState("NAME_ASC");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const oils = allOils as Oil[];

  useEffect(() => {
    fetchOils();
  }, []);

  const oilTypeOptions = useMemo(() => {
    const unique = new Set(oils.map((oil) => getOilTypeValue(oil.oil_type)));
    return ["ALL", ...Array.from(unique).sort()];
  }, [oils]);

  const tagOptions = useMemo(() => {
    const unique = new Set<string>();
    oils.forEach((oil) => oil.tags?.forEach((tag) => unique.add(tag)));
    return Array.from(unique).sort((a, b) =>
      (OIL_TAG_LABELS[a as keyof typeof OIL_TAG_LABELS] ?? a).localeCompare(
        OIL_TAG_LABELS[b as keyof typeof OIL_TAG_LABELS] ?? b,
      ),
    );
  }, [oils]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedSort("NAME_ASC");
    setSelectedType("ALL");
    setSelectedTags([]);
  };

  const hasActiveFilters =
    search.trim().length > 0 ||
    selectedSort !== "NAME_ASC" ||
    selectedType !== "ALL" ||
    selectedTags.length > 0;

  const emptyStateMessage = search.trim()
    ? `No oils found for "${search.trim()}".`
    : "No oils found for the current filters.";

  const filtered = useMemo(() => {
    const filteredOils = oils.filter((oil) => {
      const searchTerm = search.trim().toLowerCase();
      const tags = oil.tags ?? [];

      const searchableText = [
        oil.name,
        oil.description,
        getOilTypeLabel(oil.oil_type),
        oil.origin_country ?? "",
        oil.source ?? "",
        oil.extraction_method ?? "",
        ...tags,
        ...tags.map(
          (tag) => OIL_TAG_LABELS[tag as keyof typeof OIL_TAG_LABELS] ?? tag,
        ),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchTerm.length === 0 || searchableText.includes(searchTerm);

      const matchesType =
        selectedType === "ALL" ||
        getOilTypeValue(oil.oil_type) === selectedType;

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => tags.includes(tag));

      return matchesSearch && matchesType && matchesTags;
    });

    const sortedOils = [...filteredOils];
    sortedOils.sort((left, right) => {
      switch (selectedSort) {
        case "NAME_DESC":
          return right.name.localeCompare(left.name);
        case "TYPE_ASC": {
          const typeCompare = getOilTypeLabel(left.oil_type).localeCompare(
            getOilTypeLabel(right.oil_type),
          );
          return typeCompare !== 0
            ? typeCompare
            : left.name.localeCompare(right.name);
        }
        case "ORIGIN_ASC": {
          const originCompare = (left.origin_country ?? "").localeCompare(
            right.origin_country ?? "",
          );
          return originCompare !== 0
            ? originCompare
            : left.name.localeCompare(right.name);
        }
        case "NAME_ASC":
        default:
          return left.name.localeCompare(right.name);
      }
    });

    return sortedOils;
  }, [oils, search, selectedSort, selectedTags, selectedType]);

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
        <div className="browse-oils-layout">
          <aside className="browse-oils-sidebar">
            <OilFilters
              search={search}
              onSearchChange={setSearch}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              oilTypeOptions={oilTypeOptions}
              selectedTags={selectedTags}
              onToggleTag={toggleTag}
              tagOptions={tagOptions}
              onClearFilters={clearFilters}
            />
          </aside>

          <div className="browse-oils-content">
            {hasActiveFilters && (
              <div
                className="browse-active-filters"
                aria-label="Active filters"
              >
                <div className="browse-active-filters-header">
                  <span className="browse-active-filters-title">
                    Active Filters
                  </span>
                  <button
                    type="button"
                    className="browse-active-filters-clear"
                    onClick={clearFilters}
                  >
                    Reset All
                  </button>
                </div>

                <div className="browse-active-filters-list">
                  {search.trim().length > 0 && (
                    <button
                      type="button"
                      className="browse-active-filter-pill"
                      onClick={() => setSearch("")}
                    >
                      Search: {search.trim()} <span aria-hidden="true">x</span>
                    </button>
                  )}

                  {selectedSort !== "NAME_ASC" && (
                    <button
                      type="button"
                      className="browse-active-filter-pill"
                      onClick={() => setSelectedSort("NAME_ASC")}
                    >
                      Sort: {SORT_LABELS[selectedSort]}{" "}
                      <span aria-hidden="true">x</span>
                    </button>
                  )}

                  {selectedType !== "ALL" && (
                    <button
                      type="button"
                      className="browse-active-filter-pill"
                      onClick={() => setSelectedType("ALL")}
                    >
                      Type: {selectedType.replace(/_/g, " ")}{" "}
                      <span aria-hidden="true">x</span>
                    </button>
                  )}

                  {selectedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className="browse-active-filter-pill"
                      onClick={() => toggleTag(tag)}
                    >
                      Tag:{" "}
                      {OIL_TAG_LABELS[tag as keyof typeof OIL_TAG_LABELS] ??
                        tag}{" "}
                      <span aria-hidden="true">x</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="browse-results-count">
              Showing {filtered.length} of {oils.length} oils
            </p>

            <div className="oil-grid">
              {filtered.map((oil) => (
                <OilCard key={oil.id} oil={oil} />
              ))}
              {filtered.length === 0 && (
                <p className="browse-empty">{emptyStateMessage}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
