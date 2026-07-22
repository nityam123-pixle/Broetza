"use client";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

const faqs = [
  { q: "Are you 100% Vegetarian?", a: "Yes! We are a 100% pure vegetarian brand serving the best pizza, pasta, and beverages in Ahmedabad." },
  { q: "Where are your outlets?", a: "We currently have three live outlets in Mani Nagar, Gota, and Jagatpur, with a new one coming soon to Bapunagar!" },
  { q: "Do you deliver?", a: "Yes, you can order Bro'etza directly through Zomato and Swiggy from any of our outlets. Online ordering on our website is coming soon!" },
  { q: "What is your specialty?", a: "We specialize in wood-fired, handcrafted 100% veg pizzas and an amazing range of pastas." },
  { q: "How is the dough prepared?", a: "Our dough is prepared fresh daily. No shortcuts, just quality ingredients and the perfect crust every single time." },
];

export default function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const faqSection = document.querySelector(".faq-section") as HTMLElement;
    if (!faqSection) return;

    const entranceTl = gsap.timeline({ paused: true });
    gsap.set(".faq-breaker", { scaleY: 0, opacity: 0 });
    gsap.set(".faq-statement .line", { yPercent: 100 });
    gsap.set(".faq-eyebrow, .faq-sub, .faq-foot", { opacity: 0, y: 25 });
    gsap.set(".faq-row", { opacity: 0, y: 35 });

    entranceTl
      .to(".faq-breaker", { scaleY: 1, opacity: 1, duration: 0.65, ease: "power3.out" })
      .to(".faq-statement .line", { yPercent: 0, duration: 0.85, ease: "power3.out", stagger: 0.1 }, "-=0.3")
      .to(".faq-eyebrow, .faq-sub, .faq-foot", { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 }, "-=0.5")
      .to(".faq-row", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, onComplete: () => ScrollTrigger.refresh() }, "-=0.5");

    ScrollTrigger.create({
      trigger: faqSection, start: "top 85%", end: "bottom 15%",
      onEnter: () => entranceTl.play(), onLeave: () => entranceTl.reverse(),
      onEnterBack: () => entranceTl.play(), onLeaveBack: () => entranceTl.reverse(),
    });

    // Accordion
    const rows = gsap.utils.toArray<HTMLElement>(".faq-row");
    rows.forEach((row) => {
      const trigger = row.querySelector(".faq-trigger")!;
      const panel = row.querySelector(".faq-panel")!;
      const inner = row.querySelector(".faq-panel-inner")!;
      const icon = row.querySelector(".faq-icon")!;
      const fillLetters = row.querySelectorAll(".text-fill .letter");
      const outlineLetters = row.querySelectorAll(".text-outline .letter");
      const startsOpen = row.classList.contains("is-open");

      gsap.set(panel, { height: 0 });
      gsap.set(fillLetters, { yPercent: startsOpen ? -100 : 0, y: 0 });
      gsap.set(outlineLetters, { yPercent: startsOpen ? 0 : 100, y: 0 });
      if (startsOpen) gsap.set(icon, { rotate: 45 });

      const tl = gsap.timeline({ paused: true })
        .to(panel, { height: () => (inner as HTMLElement).offsetHeight, duration: 0.6, ease: "power3.out", onComplete: () => ScrollTrigger.refresh() })
        .fromTo(inner, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.1)
        .to(icon, { rotate: 45, duration: 0.5, ease: "power3.out" }, 0);

      if (startsOpen) setTimeout(() => tl.progress(1), 50);
      (row as any)._tl = tl;

      trigger.addEventListener("mouseenter", () => {
        if (row.classList.contains("is-open")) return;
        gsap.killTweensOf([fillLetters, outlineLetters]);
        gsap.to(fillLetters, { yPercent: -100, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
        gsap.to(outlineLetters, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
      });
      trigger.addEventListener("mouseleave", () => {
        if (row.classList.contains("is-open")) return;
        gsap.killTweensOf([fillLetters, outlineLetters]);
        gsap.to(fillLetters, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
        gsap.to(outlineLetters, { yPercent: 100, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
      });

      trigger.addEventListener("click", () => {
        const isOpen = row.classList.contains("is-open");
        rows.forEach((other) => {
          if (other !== row && other.classList.contains("is-open")) {
            other.classList.remove("is-open");
            (other as any)._tl.reverse();
            const otherFill = other.querySelectorAll(".text-fill .letter");
            const otherOutline = other.querySelectorAll(".text-outline .letter");
            gsap.killTweensOf([otherFill, otherOutline]);
            gsap.to(otherFill, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
            gsap.to(otherOutline, { yPercent: 100, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
          }
        });
        row.classList.toggle("is-open", !isOpen);
        if (isOpen) {
          tl.reverse();
          gsap.killTweensOf([fillLetters, outlineLetters]);
          gsap.to(fillLetters, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
          gsap.to(outlineLetters, { yPercent: 100, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
        } else {
          tl.play();
          gsap.killTweensOf([fillLetters, outlineLetters]);
          gsap.to(fillLetters, { yPercent: -100, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
          gsap.to(outlineLetters, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
        }
      });
    });

    const resizeHandler = () => {
      rows.forEach((row) => {
        if (row.classList.contains("is-open")) {
          const inner = row.querySelector(".faq-panel-inner") as HTMLElement;
          gsap.set(row.querySelector(".faq-panel"), { height: inner.offsetHeight });
        }
      });
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  });

  return (
    <section className="faq-section" ref={sectionRef}>
      <div className="faq-grid">
        <div className="faq-left">
          <div className="faq-eyebrow">Good to know</div>
          <h1 className="faq-statement">
            <span className="line-wrap"><span className="line">Question</span></span>
            <span className="line-wrap"><span className="line">we <span className="accent">have</span></span></span>
            <span className="line-wrap"><span className="line"><span className="outline">answer</span></span></span>
          </h1>
          <p className="faq-sub">Everything people usually ask before their first visit — and a few things they ask after.</p>
          <div className="faq-foot">
            <p>Still curious?</p>
            <a href="#">Get in touch →</a>
          </div>
        </div>

        <div className="faq-list" id="faqList">
          {faqs.map((faq, i) => (
            <div className={`faq-row${i === 0 ? " is-open" : ""}`} key={i}>
              <button className="faq-trigger">
                <span className="faq-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-question">
                  <span className="text-fill">
                    {faq.q.split("").map((c, j) => <span className="letter" key={j}>{c === " " ? "\u00a0" : c}</span>)}
                  </span>
                  <span className="text-outline">
                    {faq.q.split("").map((c, j) => <span className="letter" key={j}>{c === " " ? "\u00a0" : c}</span>)}
                  </span>
                </span>
                <span className="faq-icon"><span></span><span></span></span>
              </button>
              <div className="faq-panel">
                <div className="faq-panel-inner">
                  <p className="faq-answer">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}