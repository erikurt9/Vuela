function initials(name) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export default function Avatar({ name, url, size = "h-9 w-9", text = "text-sm" }) {
  if (url) {
    return <img src={url} alt="" referrerPolicy="no-referrer" className={size + " rounded-full object-cover"} />;
  }
  return (
    <span className={size + " " + text + " grid shrink-0 place-items-center rounded-full bg-brand font-semibold text-white"} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
