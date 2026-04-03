import React from "react";
import { OIL_TAG_LABELS } from "../../types/OilTag";
import "../../styles/OilFilters.css";

interface OilFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedSort: string;
  onSortChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  oilTypeOptions: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  tagOptions: string[];
  onClearFilters: () => void;
}

export default function OilFilters({
  search,
  onSearchChange,
  selectedSort,
  onSortChange,
  selectedType,
  onTypeChange,
  oilTypeOptions,
  selectedTags,
  onToggleTag,
  tagOptions,
  onClearFilters,
}: OilFiltersProps) {
  return (
    <section className="oil-filters" aria-label="Oil search and filters">
      <div className="oil-filters-header">
        <h2 className="oil-filters-title">Filters</h2>
      </div>

      <div className="oil-filters-search-row">
        <input
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="oil-filters-search-input"
        />
      </div>

      <div className="oil-filters-controls-column">
        <div className="oil-filters-control-group">
          <label htmlFor="oil-sort-filter" className="oil-filters-label">
            Sort By
          </label>
          <select
            id="oil-sort-filter"
            className="oil-filters-select"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="NAME_ASC">Name: A to Z</option>
            <option value="NAME_DESC">Name: Z to A</option>
            <option value="TYPE_ASC">Type</option>
            <option value="ORIGIN_ASC">Origin</option>
          </select>
        </div>

        <div className="oil-filters-control-group">
          <label htmlFor="oil-type-filter" className="oil-filters-label">
            Oil Type
          </label>
          <select
            id="oil-type-filter"
            className="oil-filters-select"
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            {oilTypeOptions.map((oilType) => (
              <option key={oilType} value={oilType}>
                {oilType === "ALL" ? "All Types" : oilType.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="oil-filters-control-group oil-filters-tags-group">
          <span className="oil-filters-label">Tags</span>
          <details className="oil-filters-tag-dropdown">
            <summary className="oil-filters-tag-summary">
              {selectedTags.length === 0
                ? "All Tags"
                : `${selectedTags.length} tag${selectedTags.length === 1 ? "" : "s"} selected`}
            </summary>
            <div
              className="oil-filters-tag-panel"
              role="group"
              aria-label="Filter by tags"
            >
              {tagOptions.map((tag) => {
                const label =
                  OIL_TAG_LABELS[tag as keyof typeof OIL_TAG_LABELS] ?? tag;
                return (
                  <label key={tag} className="oil-filters-tag-option">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => onToggleTag(tag)}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
