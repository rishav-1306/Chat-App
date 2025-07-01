export default function Message({ data, self }) {
  return (
    <div className={`message ${self ? "self" : "other"}`}>
      <div className="meta">
        <span className="author">{data.author}</span>
        <span className="time">{data.time}</span>
      </div>
      <p className="text">{data.message}</p>
    </div>
  );
}
