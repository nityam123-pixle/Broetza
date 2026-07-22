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
      // Header elements prepared for entrance
      gsap.set(".main-header", { opacity: 0 });
      gsap.set(".nav-logo img", { scale: 0 });
      gsap.set(".nav-link .text-fill .letter", { yPercent: 100, y: 0 });
      gsap.set(".nav-link .text-outline .letter", { yPercent: 100, y: 0 });
      gsap.set(".nav-compact-actions", { yPercent: 0, y: 15, opacity: 0, pointerEvents: "none" });
      gsap.set(".preloader-logo", { scale: 0.7, opacity: 0 });
      gsap.set(".preloader-revealer", { clipPath: "circle(0% at 50% 50%)" });

      const t1 = gsap.timeline({ delay: 0.1, onComplete: initNavbarHover });

      // 1. Circle animation plays FIRST from center (50% 50%)
      t1.to(".preloader-revealer", { clipPath: "circle(100% at 50% 50%)", duration: 0.8, stagger: 0.12, ease: "power2.inOut" });

      // 2. THEN Bro'etza logo appears in center
      t1.to(".preloader-logo", { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.2");
      t1.to({}, { duration: 0.4 }); // Short hold

      // 3. START Hero reveal: Remove preloader-active class FROM BODY IMMEDIATELY so layout unfreezes
      t1.add(() => {
        console.log("[Preloader] Curtain exit started, removing preloader-active class at timestamp:", performance.now());
        document.body.classList.remove("preloader-active");
        ScrollTrigger.refresh();
        const heroCopy = document.querySelector(".scrub-story .hero-copy") as any;
        if (heroCopy && typeof heroCopy.in === "function") {
          heroCopy.in();
        }
      });

      // 4. Exit logo & preloader curtain into Hero section + Header
      t1.to(".preloader-logo", { y: "-100vh", opacity: 0, duration: 0.5, ease: "power2.in" });
      t1.to(".preloader-bg", { opacity: 0, duration: 0.4 }, "-=0.3");
      t1.to(".main-header", { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.4");

      // 5. Reveal navbar logo and nav links
      t1.to(".nav-logo img", { scale: 1, duration: 0.5, ease: "power3.out" }, "-=0.3");
      t1.to(".nav-items .nav-link .text-fill .letter", { yPercent: 0, duration: 0.5, ease: "power3.out", stagger: 0.02 }, "<");

      t1.set(".preloader", { display: "none" });
      t1.add(() => {
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