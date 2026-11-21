/* A section number that answers the cursor: each glyph springs on its own beat,
   so "(01)" reads as four small pieces rather than one label. The spans hold the
   real characters, so the number is still read out as text. */
export default function Numeral({ children }) {
  const chars = String(children).split("");
  return (
    <em className="rd-num">
      {chars.map((ch, i) => (
        <span key={i} style={{ "--i": i }}>{ch}</span>
      ))}
    </em>
  );
}
