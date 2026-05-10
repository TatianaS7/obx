import "../../styles/ProductGuide.css";

const SECTIONS = [
  {
    title: "Product Types",
    items: [
      { name: "Hair Oil", desc: "Nourishes the scalp and promotes growth." },
      { name: "Cuticle Oil", desc: "Hydrates and strengthens nails and cuticles." }
    ],
  },
  {
    title: "Bottle Types",
    items: [
      {
        name: "Dropper Bottle",
        desc: "Precise control for targeted application.",
      },
      {
        name: "Brush Bottle",
        desc: "Even application across nails and cuticles.",
      }
    ],
  },
  {
    title: "Blend Categories",
    items: [
      { name: "Premade", desc: "Curated by our team — ready to go." },
      {
        name: "Custom",
        desc: "Build your own formula with base, secondary, and add-on oils within size limits.",
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
