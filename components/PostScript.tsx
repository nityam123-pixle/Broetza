"use client";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export default function PostScript() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Paragraph word reveals
    const paragraphs = document.querySelectorAll<HTMLElement>(".post-script .statement-copy p, .post-script .process-card p");
    paragraphs.forEach((p) => {
      const split = SplitText.create(p, { type: "words" });
      gsap.from(split.words, {
        scrollTrigger: { trigger: p, start: "top 85%", toggleActions: "play none none none" },
        opacity: 0, y: 15, stagger: 0.04, duration: 0.2, ease: "power2.out",
      });
    });

    // Hero-style header char reveals
    const heroStyleHeaders = document.querySelectorAll<HTMLElement>("#method-title, .process-card h3");
    heroStyleHeaders.forEach((header) => {
      const split = SplitText.create(header, { type: "lines, words, chars", charsClass: "char", wordsClass: "word" });
      gsap.from(split.chars, {
        scrollTrigger: { trigger: header, start: "top 85%", toggleActions: "play none none none" },
        y: 50, opacity: 0, scale: 0.5, duration: 1.5, stagger: 0.015, ease: "elastic.out(0.75, 0.25)",
      });
    });

    // IntersectionObserver for .reveal elements in post-script
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
    document.querySelectorAll(".post-script .reveal").forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  });

  return (
    <section className="post-script" id="story" aria-labelledby="method-title" ref={sectionRef}>
      <div className="statement">
        <p className="section-label reveal">Our Story / 02</p>
        <div>
          <h2 className="reveal" id="method-title">
            Pizza with <span className="outline">&apos;Aaha!</span>
          </h2>
          <div className="statement-copy reveal">
            <p>Bro&apos;etza brings a fun, casual energy to pure vegetarian pizza. No corporate menu cards—just friends hyping up your favorite food.</p>
            <p>Positioned to be the best pizza brand of Ahmedabad and all of Gujarat.</p>
          </div>
        </div>
      </div>

      <div className="process-grid" aria-label="The Bro'etza method">
        <article className="process-card reveal">
          <span className="card-index">01 / Fresh</span>
          <div>
            <h3>Fresh Dough Daily.</h3>
            <p>Prepared fresh daily. No shortcuts, just quality ingredients and the perfect crust every single time.</p>
          </div>
        </article>
        <article className="process-card reveal">
          <span className="card-index">02 / 100% Veg</span>
          <div>
            <h3>Stack the flavour on purpose.</h3>
            <p>Bright first, smoky second, then just enough spice to keep the conversation going.</p>
          </div>
        </article>
        <article className="process-card reveal">
          <span className="card-index">03 / &apos;Aaha!&apos;</span>
          <div>
            <h3>Put it somewhere hot.</h3>
            <p>The final ingredient is fire. It rounds the edges, wakes the sauce, and makes the table go quiet.</p>
          </div>
        </article>
      </div>
    </section>
  );
}