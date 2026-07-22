"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { NavLink } from "./NavLink";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

const ASCII_CHARS = "... ... .. :::=+xX#0369";
const FONT_SIZE = 16;
const CELL_SIZE = 18;
const ASCII_COLUMNS = 100;
const DPR = 2;
const CHAR_COLOR = "#BC3330";
const HOVER_COLOR = "#374C8C";
const HOVER_CHAR_COLOR = "#FFFFFF";
const HOVER_RADIUS = 8;
const CLUSTER_SIZE = 10;
const HIGHLIGHT_LIFETIME = 300;
const PARALLAX_STRENGTH = 20;
const PARALLAX_EASE = 0.05;

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // SplitText for footer heading and content
    const headings = document.querySelectorAll(".footer-header h1");
    const chars: Element[] = [];
    headings.forEach((heading) => {
      const split = SplitText.create(heading, { type: "chars", charsClass: "char" });
      chars.push(...split.chars);
    });
    gsap.set(chars, { position: "relative", yPercent: 125 });

    const elements = document.querySelectorAll(".footer-links a, .footer-text p");
    const lines: Element[] = [];
    elements.forEach((el) => {
      const childSplit = SplitText.create(el, { type: "lines", linesClass: "line-child" });
      SplitText.create(el, { type: "lines", linesClass: "line-parent" });
      lines.push(...childSplit.lines);
    });
    gsap.set(lines, { yPercent: 100 });

    const reveal = { left: -125, right: 125 };
    const handWrappers = [...document.querySelectorAll<HTMLElement>(".footer-hand-img")];
    const parallaxScale = 1 + (PARALLAX_STRENGTH * 2) / 200;

    const animateIn = () => {
      gsap.to(reveal, { left: 20, right: -20, duration: 1.2, ease: "power3.out", overwrite: true });
      gsap.to(chars, { yPercent: 0, duration: 1, ease: "power3.out", stagger: { ease: 0.04 as any, from: "center" }, overwrite: true });
      gsap.to(lines, { yPercent: 0, duration: 1, ease: "power3.out", stagger: 0.08, overwrite: true });
    };
    const animateOut = () => {
      gsap.to(reveal, { left: -125, right: 125, duration: 0.5, ease: "power2.in", overwrite: true });
      gsap.to(chars, { yPercent: 125, duration: 0.4, ease: "power2.in", stagger: { ease: 0.01 as any, from: "center" }, overwrite: true });
      gsap.to(lines, { yPercent: 100, duration: 0.4, ease: "power2.in", stagger: 0.02, overwrite: true });
    };

    ScrollTrigger.create({ trigger: ".footer-revealer", start: "top 50%", onEnter: animateIn });
    ScrollTrigger.create({ trigger: ".footer-revealer", start: "top 85%", onLeaveBack: animateOut });
    ScrollTrigger.create({
      trigger: ".footer-revealer", start: "top 10px",
      onEnter: () => gsap.to(".main-header", { yPercent: -100, autoAlpha: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" }),
      onLeaveBack: () => gsap.to(".main-header", { yPercent: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" }),
    });

    // Footer nav link hovers
    document.querySelectorAll(".footer-nav-link").forEach((link) => {
      const fillLetters = link.querySelectorAll(".text-fill .letter");
      const outlineLetters = link.querySelectorAll(".text-outline .letter");
      gsap.set(fillLetters, { yPercent: 0, y: 0 });
      gsap.set(outlineLetters, { yPercent: 100, y: 0 });
      link.addEventListener("mouseenter", () => {
        gsap.killTweensOf([fillLetters, outlineLetters]);
        gsap.to(fillLetters, { yPercent: -100, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
        gsap.to(outlineLetters, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
      });
      link.addEventListener("mouseleave", () => {
        gsap.killTweensOf([fillLetters, outlineLetters]);
        gsap.to(fillLetters, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
        gsap.to(outlineLetters, { yPercent: 100, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
      });
    });

    // Parallax for hand wrappers using the reveal object
    const pointer = { x: 0, y: 0 };
    const drift = { x: 0, y: 0 };
    const footer = document.querySelector("footer");

    const renderParallax = () => {
      drift.x += (pointer.x - drift.x) * PARALLAX_EASE;
      drift.y += (pointer.y - drift.y) * PARALLAX_EASE;
      handWrappers.forEach((wrapper, i) => {
        const direction = i === 0 ? 1 : -1;
        const revealX = i === 0 ? reveal.left : reveal.right;
        wrapper.style.transform = `translate(calc(${drift.x * direction}px + ${revealX}%), ${-drift.y}px) scale(${parallaxScale})`;
      });
      requestAnimationFrame(renderParallax);
    };
    renderParallax();

    window.addEventListener("mouseover", (event) => {
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * PARALLAX_STRENGTH * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * PARALLAX_STRENGTH * 2;
    });
  });

  // ASCII hand canvas effect (runs outside GSAP scope for RAF cleanup)
  useEffect(() => {
    const rafs: number[] = [];

    const sampleImagePixels = (image: HTMLImageElement, gridRows: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = ASCII_COLUMNS; canvas.height = gridRows;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(image, 0, 0, ASCII_COLUMNS, gridRows);
      return ctx.getImageData(0, 0, ASCII_COLUMNS, gridRows).data;
    };
    const pixelToCharIndex = (pixels: Uint8ClampedArray, offset: number) => {
      const brightness = (pixels[offset] * 0.299 + pixels[offset + 1] * 0.587 + pixels[offset + 2] * 0.114) / 255;
      return Math.min(ASCII_CHARS.length - 1, Math.floor((1 - brightness) * ASCII_CHARS.length));
    };
    const buildCells = (image: HTMLImageElement) => {
      const rows = Math.round(ASCII_COLUMNS / (image.naturalWidth / image.naturalHeight));
      const pixels = sampleImagePixels(image, rows);
      const cells = new Map<string, { col: number; row: number; char: string; highlightEndTime: number }>();
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < ASCII_COLUMNS; col++) {
          const charIndex = pixelToCharIndex(pixels, (row * ASCII_COLUMNS + col) * 4);
          if (charIndex <= 4) continue;
          cells.set(`${col},${row}`, { col, row, char: ASCII_CHARS[charIndex], highlightEndTime: 0 });
        }
      }
      return { rows, cells };
    };

    const hands: { canvas: HTMLCanvasElement; cells: Map<string, any>; cellList: any[]; rows: number }[] = [];

    document.querySelectorAll<HTMLImageElement>("img.ascii-hand").forEach((image) => {
      const canvas = document.createElement("canvas");
      image.closest(".footer-hand-img")?.appendChild(canvas);

      const setup = () => {
        const { rows, cells } = buildCells(image);
        const cellList = [...cells.values()];
        canvas.width = ASCII_COLUMNS * CELL_SIZE * DPR;
        canvas.height = rows * CELL_SIZE * DPR;
        const ctx = canvas.getContext("2d")!;
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        ctx.font = `${FONT_SIZE}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        const metrics = ctx.measureText("X");
        const glyphHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        const baselineOffset = CELL_SIZE / 2 + glyphHeight / 2 - metrics.actualBoundingBoxDescent;
        const canvasWidth = ASCII_COLUMNS * CELL_SIZE;
        const canvasHeight = rows * CELL_SIZE;

        const render = () => {
          const now = Date.now();
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          for (const cell of cellList) {
            const x = cell.col * CELL_SIZE;
            const y = cell.row * CELL_SIZE;
            const isHighlighted = cell.highlightEndTime > now;
            if (isHighlighted) { ctx.fillStyle = HOVER_COLOR; ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE); }
            ctx.fillStyle = isHighlighted ? HOVER_CHAR_COLOR : CHAR_COLOR;
            ctx.fillText(cell.char, x + CELL_SIZE / 2, y + baselineOffset);
          }
          rafs.push(requestAnimationFrame(render));
        };
        render();
        hands.push({ canvas, cells, cellList, rows });
      };

      if (image.complete && image.naturalWidth) setup();
      else image.addEventListener("load", setup);
    });

    const highlightCluster = (cells: Map<string, any>, startCell: any) => {
      const now = Date.now();
      startCell.highlightEndTime = now + HIGHLIGHT_LIFETIME;
      const steps = Math.floor(Math.random() * CLUSTER_SIZE) + 1;
      const litCells = [startCell];
      let current = startCell;
      for (let step = 0; step < steps; step++) {
        const neighbours: any[] = [];
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const n = cells.get(`${current.col + dx},${current.row + dy}`);
          if (n && !litCells.includes(n)) neighbours.push(n);
        }
        if (!neighbours.length) break;
        const next = neighbours[Math.floor(Math.random() * neighbours.length)];
        next.highlightEndTime = now + HIGHLIGHT_LIFETIME + step * 10;
        litCells.push(next); current = next;
      }
    };

    const mouseMoveHandler = (event: MouseEvent) => {
      hands.forEach((hand) => {
        const rect = hand.canvas.getBoundingClientRect();
        const mouseCol = ((event.clientX - rect.left) / rect.width) * ASCII_COLUMNS;
        const mouseRow = ((event.clientY - rect.top) / rect.height) * hand.rows;
        let closest: any = null; let closestDist = Infinity;
        for (const cell of hand.cellList) {
          const dx = mouseCol - cell.col; const dy = mouseRow - cell.row;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < closestDist) { closestDist = dist; closest = cell; }
        }
        if (closest && closestDist <= HOVER_RADIUS) highlightCluster(hand.cells, closest);
      });
    };
    window.addEventListener("mousemove", mouseMoveHandler);
    return () => { window.removeEventListener("mousemove", mouseMoveHandler); rafs.forEach(cancelAnimationFrame); };
  }, []);

  return (
    <div className="footer-revealer" ref={footerRef}>
      <footer>
        <div className="footer-reservation-moment" id="reserve">
          <h2 className="reservation-title">Craving the &apos;Aaha!&apos;?</h2>
          <div className="reservation-cta-wrapper">
            <a href="#reserve" className="btn-get-sauce reserve-cta reserve-trigger-btn">
              <span className="btn-text-wrapper">
                <span className="btn-text-first">Order on Zomato</span>
                <span className="btn-text-second">Order on Zomato</span>
              </span>
            </a>
          </div>
        </div>
        <p className="reservation-note">Mani Nagar &middot; Gota &middot; Jagatpur &middot; Coming soon to Bapunagar!</p>

        <div className="footer-images">
          <div className="footer-hand-img">
            <img className="ascii-hand" src="/assets/hand-left.png" alt="Hand Illustration" />
          </div>
          <div className="footer-hand-img">
            <img className="ascii-hand" src="/assets/hand-right.png" alt="Hand Illustration" />
          </div>
        </div>

        <div className="footer-content">
          <nav className="footer-links">
            {[["#menu","Menu"],["#visit","Locations"],["#story","Our Story"],["#reserve","Reserve"],["#faq","FAQ"]].map(([href, text]) => (
              <a href={href} className="footer-nav-link" key={href}>
                <span className="text-fill">
                  {text.split("").map((c, i) => <span className="letter" key={i}>{c === " " ? "\u00a0" : c}</span>)}
                </span>
                <span className="text-outline">
                  {text.split("").map((c, i) => <span className="letter" key={i}>{c === " " ? "\u00a0" : c}</span>)}
                </span>
              </a>
            ))}
          </nav>
          <div className="footer-text">
            <p>The best pizza brand of Ahmedabad. 100% Veg. Serving up the &apos;Aaha!&apos; in Mani Nagar, Gota, and Jagatpur.</p>
          </div>
        </div>

        <div className="footer-header">
          <h1>Bro&apos;etza</h1>
          <h1>Pizza</h1>
        </div>
      </footer>
    </div>
  );
}