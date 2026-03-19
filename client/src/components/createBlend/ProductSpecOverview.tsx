import { formatSpecValue } from "./utils";

interface ProductSpecOverviewProps {
  productType: string;
  category: string;
  bottleType: string;
  bottleSize: string;
  allowedRules: string;
}

export default function ProductSpecOverview({
  productType,
  category,
  bottleType,
  bottleSize,
  allowedRules,
}: ProductSpecOverviewProps) {
  return (
    <section className="blend-section product-spec-overview">
      <h3 className="blend-section-title">Selected Product Specifications</h3>
      <div className="product-spec-grid">
        <div className="product-spec-item">
          <span className="product-spec-label">Product Type</span>
          <span className="product-spec-value">
            {formatSpecValue(productType)}
          </span>
        </div>
        <div className="product-spec-item">
          <span className="product-spec-label">Blend Category</span>
          <span className="product-spec-value">
            {formatSpecValue(category)}
          </span>
        </div>
        <div className="product-spec-item">
          <span className="product-spec-label">Bottle Type</span>
          <span className="product-spec-value">
            {formatSpecValue(bottleType)}
          </span>
        </div>
        <div className="product-spec-item">
          <span className="product-spec-label">Bottle Size</span>
          <span className="product-spec-value">
            {bottleSize || "Not selected"}
          </span>
        </div>
      </div>
      <p className="product-spec-rules">{allowedRules}</p>
    </section>
  );
}
