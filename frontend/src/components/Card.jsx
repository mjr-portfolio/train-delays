const baseStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "1.25rem",
  marginBottom: "1.5rem",
  background: "rgba(255,255,255,0.03)",
};

export default function Card({ children, style = {} }) {
  return <div style={{ ...baseStyle, ...style }}>{children}</div>;
}
