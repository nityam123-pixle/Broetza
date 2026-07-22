"use client";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

function initNavbarHover() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    const fillLetters = link.querySelectorAll(".text-fill .letter");
    const outlineLetters = link.querySelectorAll(".text-outline .letter");
    link.addEventListener("mouseenter", () => {
      gsap.to(fillLetters, { yPercent: -100, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
      gsap.to(outlineLetters, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
    });
    link.addEventListener("mouseleave", () => {
      gsap.to(fillLetters, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
      gsap.to(outlineLetters, { yPercent: 100, duration: 0.35, ease: "power3.out", stagger: 0.03, overwrite: "auto" });
    });
  });
}

export default function Preloader() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    document.fonts.ready.then(() => {
      // Prepare hero section & header to fade in smoothly under preloader
      gsap.set(".main-header, .scrub-story", { opacity: 0 });
      gsap.set(".nav-logo img", { scale: 0 });
      gsap.set(".nav-link .text-fill .letter", { yPercent: 100, y: 0 });
      gsap.set(".nav-link .text-outline .letter", { yPercent: 100, y: 0 });
      gsap.set(".nav-compact-actions", { yPercent: 0, y: 15, opacity: 0, pointerEvents: "none" });
      gsap.set(".preloader-logo", { scale: 0.7, opacity: 0 });
      gsap.set(".preloader-revealer", { clipPath: "circle(0% at 50% 50%)" });

      const t1 = gsap.timeline({ delay: 0.2, onComplete: initNavbarHover });

      // 1. Circle animation plays FIRST from center (50% 50%)
      t1.to(".preloader-revealer", { clipPath: "circle(100% at 50% 50%)", duration: 0.9, stagger: 0.15, ease: "power2.inOut" });

      // 2. THEN Bro'etza logo appears in center
      t1.to(".preloader-logo", { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.3");
      t1.to({}, { duration: 0.5 }); // Short hold

      // 3. Exit logo & preloader curtain into Hero section + Header
      t1.to(".preloader-logo", { y: "-100vh", opacity: 0, duration: 0.6, ease: "power2.in" });
      t1.to(".preloader-bg", { opacity: 0, duration: 0.5 }, "-=0.4");
      t1.to(".main-header, .scrub-story", { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.6");

      // 4. Reveal navbar logo and nav links
      t1.to(".nav-logo img", { scale: 1, duration: 0.6, ease: "power3.out" }, "-=0.4");
      t1.to(".nav-items .nav-link .text-fill .letter", { yPercent: 0, duration: 0.6, ease: "power3.out", stagger: 0.02 }, "<");

      t1.set(".preloader", { display: "none" });
      t1.add(() => {
        document.body.classList.remove("preloader-active");
        ScrollTrigger.refresh();
      });
    });
  });

  return (
    <div className="preloader" ref={container}>
      <div className="preloader-bg"></div>
      <div className="preloader-revealer preloader-revealer-1"></div>
      <div className="preloader-revealer preloader-revealer-2"></div>
      <div className="preloader-revealer preloader-revealer-3"></div>
      <div className="preloader-revealer preloader-revealer-4"></div>
      <div className="preloader-logo"><img src="/assets/broetza-logo.svg" alt="Logo" /></div>
    </div>
  );
}