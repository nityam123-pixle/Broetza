"use client";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export default function ClosingPanel() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Header char reveal (#sauce-title)
    const sauceTitle = document.getElementById("sauce-title");
    if (sauceTitle) {
      const split = SplitText.create(sauceTitle, {
        type: "lines, words, chars",
        charsClass: "char",
        wordsClass: "word",
      });
      gsap.from(split.chars, {
        scrollTrigger: {
          trigger: sauceTitle,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 50,
        opacity: 0,
        scale: 0.5,
        duration: 1.5,
        stagger: 0.015,
        ease: "elastic.out(0.75, 0.25)",
      });
    }

    // Paragraph word reveal (.closing-panel p:not(.eyebrow))
    const paragraphs = document.querySelectorAll<HTMLElement>(".closing-panel p:not(.eyebrow)");
    paragraphs.forEach((p) => {
      const split = SplitText.create(p, { type: "words" });
      gsap.from(split.words, {
        scrollTrigger: {
          trigger: p,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 15,
        stagger: 0.04,
        duration: 0.2,
        ease: "power2.out",
      });
    });

    // CTA Button Reveal (.closing-panel .button)
    const buttons = document.querySelectorAll<HTMLElement>(".closing-panel .button");
    if (buttons.length > 0) {
      gsap.from(buttons, {
        scrollTrigger: {
          trigger: ".closing-panel .button",
          start: "top 90%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        scale: 0.85,
        duration: 0.8,
        ease: "back.out(1.7)",
      });
    }

    // IntersectionObserver for .reveal elements in closing panel
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".closing-panel .reveal").forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  });

  return (
    <section className="closing-panel" id="sauce" aria-labelledby="sauce-title" ref={sectionRef}>
      <div className="reveal">
        <p className="eyebrow">Order Now / 03</p>
        <h2 id="sauce-title">The good stuff is <span className="ember">delivered.</span></h2>
        <p>Hit up your favorite delivery app to get Ahmedabad&apos;s best pizza delivered hot and fresh to your door. Online ordering coming soon!</p>
        <div className="closing-panel-actions">
          <a className="button btn-zomato" href="#order" target="_blank">
            <img src="/assets/zomato.svg" alt="Zomato" className="btn-logo" />
            Order on Zomato <span className="arrow">→</span>
          </a>
          <a className="button btn-swiggy" href="#order" target="_blank">
            <img src="/assets/swiggy.svg" alt="Swiggy" className="btn-logo" />
            Order on Swiggy <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}