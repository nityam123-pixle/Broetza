"use client";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);

export default function VideoScrub() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const video = document.querySelector("#fireVideo") as HTMLVideoElement;
    const story = document.querySelector(".scrub-story") as HTMLElement;
    const stage = document.querySelector(".video-stage") as HTMLElement;
    const heroCopy = document.querySelector(".scrub-story .hero-copy") as HTMLElement & { in?: () => void; out?: () => void };
    const cues = [...document.querySelectorAll<HTMLElement>(".scrub-story .story-cue")];
    const progressFill = document.querySelector<HTMLElement>(".scrub-story .progress-fill");
    const progressCount = document.querySelector<HTMLElement>(".scrub-story .progress-count");
    const progressbar = document.querySelector<HTMLElement>(".scrub-story .heat-progress");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sceneStarts = [0.2, 0.37, 0.54, 0.7, 0.85];
    let activeScene = -1;
    let targetTime = 0;
    let renderedTime = 0;
    let videoDuration = 0;
    let isSeeking = false;

    if (!video || !story) return;

    // Preload video metadata/chunks in background, keep paused for scroll scrub ONLY
    video.preload = "auto";
    video.pause();
    video.currentTime = 0;

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

    // Story cue animations
    const cueAnimations = cues.map((cue) => {
      const h2 = cue.querySelector("h2")!;
      const p = cue.querySelector("p")!;
      const number = cue.querySelector(".cue-number");
      const kicker = cue.querySelector(".cue-kicker");
      const h2Lines = new SplitText(h2, { type: "lines" });
      const h2Words = new SplitText(h2Lines.lines, { type: "words" }).words;
      const pLines = new SplitText(p, { type: "lines" }).lines;
      const extras = [number, kicker].filter(Boolean) as HTMLElement[];
      const allElements = [...h2Words, ...pLines, ...extras];
      gsap.set(allElements, { yPercent: 120, rotateZ: 4, opacity: 0 });
      gsap.set(cue, { visibility: "hidden", opacity: 1, y: 0 });
      return {
        cue,
        in: () => {
          gsap.killTweensOf(allElements);
          gsap.set(cue, { visibility: "visible" });
          gsap.to(h2Words, { yPercent: 0, rotateZ: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: "power4.out", overwrite: "auto" });
          gsap.to(extras, { yPercent: 0, rotateZ: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out", overwrite: "auto", delay: 0.1 });
          gsap.to(pLines, { yPercent: 0, rotateZ: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: "power4.out", overwrite: "auto", delay: 0.2 });
        },
        out: (dir: number) => {
          gsap.killTweensOf(allElements);
          const exitY = dir > 0 ? -120 : 120;
          gsap.to(allElements, { yPercent: exitY, rotateZ: dir > 0 ? -4 : 4, opacity: 0, duration: 0.5, stagger: 0.01, ease: "power3.in", overwrite: "auto", onComplete: () => gsap.set(cue, { visibility: "hidden" }) });
        },
      };
    });

    const getScrollProgress = () => {
      const rect = story.getBoundingClientRect();
      const distance = Math.max(1, story.offsetHeight - window.innerHeight);
      return clamp(-rect.top / distance, 0, 1);
    };

    // Hero copy
    let isHeroCopyVisible = false;
    if (heroCopy) {
      const h1 = heroCopy.querySelector("h1")!;
      const p = heroCopy.querySelector("p:not(.eyebrow)")!;
      const eyebrow = heroCopy.querySelector(".eyebrow");
      const btn = heroCopy.querySelector(".button");
      const h1Lines = new SplitText(h1, { type: "lines" });
      const h1Words = new SplitText(h1Lines.lines, { type: "words" }).words;
      const pLines = new SplitText(p, { type: "lines" }).lines;
      const extras = [eyebrow, btn].filter(Boolean) as HTMLElement[];
      const heroCopyElements = [...h1Words, ...pLines, ...extras];

      // Keep heroCopy container visible; SplitText words animate from yPercent: 120, opacity: 0
      gsap.set(heroCopy, { visibility: "visible", opacity: 1, pointerEvents: "auto" });
      gsap.set(heroCopyElements, { yPercent: 120, rotateZ: 4, opacity: 0 });

      heroCopy.in = () => {
        if (isHeroCopyVisible) return;
        isHeroCopyVisible = true;
        gsap.killTweensOf(heroCopyElements);
        gsap.set(heroCopy, { visibility: "visible", opacity: 1, pointerEvents: "auto" });
        gsap.to(h1Words, { yPercent: 0, rotateZ: 0, opacity: 1, duration: 1.0, stagger: 0.04, ease: "power4.out", overwrite: "auto" });
        gsap.to(extras, { yPercent: 0, rotateZ: 0, opacity: 1, duration: 1.0, stagger: 0.08, ease: "power4.out", overwrite: "auto", delay: 0.1 });
        gsap.to(pLines, { yPercent: 0, rotateZ: 0, opacity: 1, duration: 1.0, stagger: 0.04, ease: "power4.out", overwrite: "auto", delay: 0.15 });
      };

      heroCopy.out = () => {
        if (!isHeroCopyVisible) return;
        isHeroCopyVisible = false;
        gsap.killTweensOf(heroCopyElements);
        gsap.set(heroCopy, { pointerEvents: "none" });
        gsap.to(heroCopyElements, { yPercent: -120, rotateZ: -4, opacity: 0, duration: 0.5, stagger: 0.01, ease: "power3.in", overwrite: "auto", onComplete: () => gsap.set(heroCopy, { visibility: "hidden" }) });
      };

      ScrollTrigger.create({
        trigger: story,
        start: "top 75%",
        onEnter: () => { if (getScrollProgress() < 0.02) heroCopy.in?.(); },
        onLeaveBack: () => {
          gsap.set(heroCopyElements, { yPercent: 120, rotateZ: 4, opacity: 0 });
          gsap.set(heroCopy, { visibility: "hidden" });
          isHeroCopyVisible = false;
        },
      });
    }

    const setScene = (progress: number) => {
      const nextScene = sceneStarts.reduce((cur, start, i) => (progress >= start ? i : cur), -1);
      if (nextScene === activeScene) return;
      const direction = nextScene > activeScene ? 1 : -1;
      if (activeScene >= 0 && cueAnimations[activeScene]) cueAnimations[activeScene].out(direction);
      if (nextScene >= 0 && cueAnimations[nextScene]) cueAnimations[nextScene].in();
      activeScene = nextScene;
      if (progressCount) progressCount.textContent = `${String(Math.max(activeScene + 1, 0)).padStart(2, "0")} / 05`;
    };

    const updateFromScroll = () => {
      const progress = getScrollProgress();
      targetTime = progress * videoDuration;
      if (heroCopy) {
        if (progress > 0.02) heroCopy.out?.();
        else if (progress <= 0.02 && !isHeroCopyVisible && story.getBoundingClientRect().top < window.innerHeight * 0.75) heroCopy.in?.();
      }
      setScene(progress);
      if (progressFill) progressFill.style.transform = `scaleX(${progress})`;
      if (progressbar) progressbar.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };

    const scrubVideo = () => {
      if (videoDuration && Number.isFinite(targetTime)) {
        const diff = targetTime - renderedTime;
        if (!isSeeking && Math.abs(diff) > 0.02) {
          renderedTime += diff * 0.04;
          video.currentTime = clamp(renderedTime, 0, videoDuration);
        }
      }
    };

    const initialiseScrub = () => {
      videoDuration = video.duration;
      renderedTime = video.currentTime || 0;
      updateFromScroll();
      ScrollTrigger.addEventListener("refresh", updateFromScroll);
      gsap.ticker.add(scrubVideo);
      gsap.to(stage, {
        y: () => window.innerHeight * 0.65, ease: "none",
        scrollTrigger: { trigger: ".post-script", start: "top bottom", end: "top top", scrub: true },
      });
    };

    video.addEventListener("error", () => stage?.classList.add("has-video-error"));
    video.addEventListener("seeking", () => { isSeeking = true; });
    video.addEventListener("seeked", () => { isSeeking = false; renderedTime = video.currentTime; });

    if (prefersReducedMotion.matches) {
      document.documentElement.classList.add("reduced-motion");
      video.loop = true; video.autoplay = true; video.play().catch(() => {});
    } else if (video.readyState >= 1) {
      initialiseScrub();
    } else {
      video.addEventListener("loadedmetadata", initialiseScrub, { once: true });
    }

    // Lenis scroll sync
    const lenisScrollHandler = updateFromScroll;
    window.addEventListener("scroll", lenisScrollHandler, { passive: true });
    return () => { window.removeEventListener("scroll", lenisScrollHandler); gsap.ticker.remove(scrubVideo); };
  });

  return (
    <section className="scrub-story" id="fire-scroll" aria-labelledby="scrub-title" ref={sectionRef}>
      <div id="top"></div>
      <div className="video-stage">
        <video className="fire-video" id="fireVideo" muted playsInline preload="auto" disablePictureInPicture aria-describedby="film-description">
          <source src="/assets/scrub.mp4" type="video/mp4" />
        </video>
        <div className="video-wash" aria-hidden="true"></div>
        <div className="video-grain" aria-hidden="true"></div>
        <div className="edge-vignette" aria-hidden="true"></div>
        <div className="stage-rule" aria-hidden="true"></div>

        <div className="hero-copy">
          <p className="eyebrow">Bro&apos;etza Presents / 01</p>
          <h1 id="scrub-title">Pizza with<br /><em>&apos;Aaha!</em></h1>
          <p id="film-description">Prepared fresh daily. No shortcuts, just quality ingredients and the perfect crust every single time.</p>
          <a className="button" href="#sauce">Explore our story <span className="arrow">→</span></a>
        </div>

        <div className="story-cues" aria-live="polite">
          {[
            { n: "01", kicker: "The start", h2: "Ahmedabad Born.", p: "Crafted for the true taste of Gujarat." },
            { n: "02", kicker: "The dough", h2: "Prepared fresh daily.", p: "We believe in authentic ingredients, made fresh in-house every single morning." },
            { n: "03", kicker: "100% Veg", h2: "Pure vegetarian pizza.", p: "Pasta, fast food, and beverages crafted to perfection for everyone to enjoy." },
            { n: "04", kicker: "The 'Aaha!'", h2: "That first bite feeling.", p: "Generous portions, bold flavors, and the energy of a friend hyping up your favorite slice." },
            { n: "05", kicker: "The table", h2: "Grab a slice.", p: "Gather around the table with your friends and family for an unforgettable meal." },
          ].map((cue, i) => (
            <article className="story-cue" data-scene={i} key={i}>
              <span className="cue-number" aria-hidden="true">{cue.n}</span>
              <div>
                <span className="cue-kicker">{cue.kicker}</span>
                <h2>{cue.h2}</h2>
                <p>{cue.p}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="heat-progress" aria-label="Film progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
          <span className="progress-count">01 / 05</span>
          <span className="progress-rail" aria-hidden="true"><span className="progress-fill"></span></span>
        </div>
        <p className="scroll-prompt" aria-hidden="true">Scroll to stoke the fire</p>
        <p className="video-fallback" role="status">The film could not load, but the story is still below: ember, dough, flame, sauce, table.</p>
      </div>
    </section>
  );
}