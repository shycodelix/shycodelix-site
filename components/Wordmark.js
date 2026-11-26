/** The one persistent signature — shy, an accent asterisk, then /26 — carried by
 *  the reader hero bar, the creator room bar and the OS title bar. It keeps the
 *  face of the bar it sits in and takes that surface's accent for the asterisk. */
export default function Wordmark({ className = "" }) {
  return (
    <span className={className ? `mark ${className}` : "mark"}>
      shy<span className="mark-star" aria-hidden="true">*</span>/26
    </span>
  );
}
