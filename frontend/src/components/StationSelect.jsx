export default function StationSelect({ stations, selected, setSelected }) {
  return (
    <>
      <select
        style={{ padding: "0.4rem 0.7rem", fontSize: "1.1rem" }}
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option>Select station...</option>
        {stations.map((s) => (
          <option key={s.id} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
    </>
  );
}
