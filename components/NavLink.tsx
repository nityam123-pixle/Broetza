// Helper: renders a word split into individual letter spans for fill/outline hover effect
export function NavLetters({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span className="letter" key={i}>{char === " " ? "\u00a0" : char}</span>
      ))}
    </>
  );
}

export function NavLink({ href, text, className = "" }: { href: string; text: string; className?: string }) {
  return (
    <a href={href} className={`nav-link${className ? " " + className : ""}`}>
      <span className="text-fill">
        <NavLetters text={text} />
      </span>
      <span className="text-outline">
        <NavLetters text={text} />
      </span>
    </a>
  );
}
