interface BlendIdentitySectionProps {
  blendName: string;
  blendDesc: string;
  onNameChange: (value: string) => void;
  onDescChange: (value: string) => void;
}

export default function BlendIdentitySection({
  blendName,
  blendDesc,
  onNameChange,
  onDescChange,
}: BlendIdentitySectionProps) {
  return (
    <section className="blend-section">
      <h3 className="blend-section-title">Name Your Blend</h3>
      <div className="blend-name-row">
        <div className="oil-slot">
          <label className="oil-slot-label">Blend Name</label>
          <input
            type="text"
            className="oil-slot-select"
            placeholder="e.g. My Growth Blend"
            value={blendName}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        <div className="oil-slot">
          <label className="oil-slot-label">Description (optional)</label>
          <input
            type="text"
            className="oil-slot-select"
            placeholder="A brief note about your blend"
            value={blendDesc}
            onChange={(e) => onDescChange(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
