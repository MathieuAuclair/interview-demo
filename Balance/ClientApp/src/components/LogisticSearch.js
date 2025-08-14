export default function LogisticSearch({
  setSearch,
  setDateBefore,
  setDateAfter,
}) {
  return (
    <div className="d-flex gap-3">
      <div className="input-group">
        <span className="input-group-text" id="addon-wrapping">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </span>
        <input
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          className="form-control"
          placeholder="номер заказа"
          aria-label="номер заказа"
          aria-describedby="addon-wrapping"
        />
      </div>
      <div className="input-group">
        <span className="input-group-text" id="addon-wrapping">
          от
        </span>
        <input
          type="date"
          onChange={(e) => {
            setDateAfter(e.target.value);
          }}
          className="form-control"
          aria-describedby="addon-wrapping"
        />
      </div>
      <div className="input-group">
        <span className="input-group-text" id="addon-wrapping">
          до
        </span>
        <input
          type="date"
          onChange={(e) => {
            setDateBefore(e.target.value);
          }}
          className="form-control"
          aria-describedby="addon-wrapping"
        />
      </div>
    </div>
  );
}
