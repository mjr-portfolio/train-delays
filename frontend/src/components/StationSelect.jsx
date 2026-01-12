export default function StationSelect({ stations, selected, setSelected }) {
  return (
    <>
      <select
        className="stationSelect"
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
