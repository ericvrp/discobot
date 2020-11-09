const cleanup = (s) => {
  if (!s) return "";
  s = s.replace("[ ]", " ");
  s = s.split("\n").join(", ");
  s = s.split("<br>").join(", ");
  s = s.split("<br/>").join(", ");
  s = s.split("<br />").join(", ");
  return s.trim();
};

module.exports = { cleanup };
