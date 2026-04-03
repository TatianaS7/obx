import "../../styles/ProductGuide.css";

const SECTIONS = [
  {
    title: "Product Types",
    items: [
      { name: "Hair Oil", desc: "Nourishes the scalp and promotes growth." },
      { name: "Fragrance Oil", desc: "Lightweight scent designed for skin." },
    ],
  },
  {
    title: "Bottle Types",
    items: [
      {
        name: "Dropper Bottle",
        desc: "Precise control for targeted application.",
      },
      // { name: "Squeeze Bottle", desc: "Easy for direct scalp application." },
    ],
  },
  {
    title: "Blend Categories",
    items: [
      { name: "Premade", desc: "Curated by our team — ready to go." },
      {
        name: "Base Custom",
        desc: "1 base oil + your choice of secondary oils.",
      },
      {
        name: "Fully Custom",
        desc: "Crafted entirely to your specifications, within size limits.",
      },
    ],
  },
];

export default function ProductGuide() {
  return (
    <aside className="product-guide">
      <h2 className="product-guide-heading">Product Guide</h2>
      {SECTIONS.map((section) => (
        <div key={section.title} className="product-guide-section">
          <h3 className="product-guide-section-title">{section.title}</h3>
          <ul className="product-guide-list">
            {section.items.map((item) => (
              <li key={item.name} className="product-guide-item">
                <span className="product-guide-item-name">{item.name}</span>
                <span className="product-guide-item-desc">{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
}
