"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { NavLink } from "./NavLink";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Scroll-triggered compact navbar swap
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ScrollTrigger.create({
      trigger: ".scrub-story",
      start: "120px top",
      onEnter: () => {
        document.querySelector(".main-header")?.classList.add("scrolled");
        gsap.to(".nav-items", { y: -15, opacity: 0, pointerEvents: "none", duration: reducedMotion ? 0 : 0.3, ease: "power2.inOut", overwrite: "auto" });
        gsap.to(".nav-compact-actions", { yPercent: 0, y: 0, opacity: 1, pointerEvents: "auto", duration: reducedMotion ? 0 : 0.3, ease: "power2.out", overwrite: "auto" });
      },
      onLeaveBack: () => {
        document.querySelector(".main-header")?.classList.remove("scrolled");
        gsap.to(".nav-items", { y: 0, opacity: 1, pointerEvents: "auto", duration: reducedMotion ? 0 : 0.3, ease: "power2.out", overwrite: "auto" });
        gsap.to(".nav-compact-actions", { yPercent: 0, y: 15, opacity: 0, pointerEvents: "none", duration: reducedMotion ? 0 : 0.3, ease: "power2.inOut", overwrite: "auto" });
      },
    });

    // Button hover animations
    const actionButtons = document.querySelectorAll(".btn-get-sauce, .hero-cta, .reserve-cta, .directions-cta, .plan-visit-btn, .submit-booking-btn");
    actionButtons.forEach((btn) => {
      const firstText = btn.querySelector(".btn-text-first");
      const secondText = btn.querySelector(".btn-text-second");
      if (!firstText || !secondText) return;
      btn.addEventListener("mouseenter", () => {
        gsap.to(firstText, { y: -16, opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        gsap.to(secondText, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(firstText, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        gsap.to(secondText, { y: 16, opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      });
    });

    // Square icon button hovers
    const squareBtns = document.querySelectorAll(".btn-square, .btn-close-menu");
    squareBtns.forEach((btn) => {
      const firstIcon = btn.querySelector(".btn-icon-first");
      const secondIcon = btn.querySelector(".btn-icon-second");
      btn.addEventListener("mouseenter", () => {
        gsap.to(firstIcon, { x: 16, opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        gsap.to(secondIcon, { x: 0, scale: 1, opacity: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(firstIcon, { x: 0, opacity: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        gsap.to(secondIcon, { x: -16, scale: 0, opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      });
    });

    // Menu drawer
    const hamburger = document.querySelector(".btn-hamburger") as HTMLElement;
    const closeBtn = document.querySelector(".btn-close-menu") as HTMLElement;
    const overlay = document.querySelector(".menu-overlay") as HTMLElement;
    const drawer = document.querySelector(".menu-drawer") as HTMLElement;
    if (!hamburger || !drawer || !overlay) return;

    const menuLinksFill = drawer.querySelectorAll(".nav-link .text-fill .letter");
    const menuLinksOutline = drawer.querySelectorAll(".nav-link .text-outline .letter");
    gsap.set(menuLinksFill, { yPercent: 100, y: 0 });
    gsap.set(menuLinksOutline, { yPercent: 100, y: 0 });

    hamburger.addEventListener("click", () => {
      overlay.classList.add("active");
      const hamburgerRect = hamburger.getBoundingClientRect();
      gsap.set(drawer, { display: "flex", xPercent: 0, x: 0, scale: 0, opacity: 0 });
      const drawerRect = drawer.getBoundingClientRect();
      const originX = hamburgerRect.left + hamburgerRect.width / 2 - drawerRect.left;
      const originY = hamburgerRect.top + hamburgerRect.height / 2 - drawerRect.top;
      gsap.set(drawer, { transformOrigin: `${originX}px ${originY}px`, borderRadius: "50%" });
      gsap.to(drawer, { scale: 1, opacity: 1, borderRadius: "1.25rem", duration: 0.6, ease: "power4.out", overwrite: "auto" });
      gsap.to(hamburger, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.inOut", overwrite: "auto" });
      gsap.to(menuLinksFill, { yPercent: 0, duration: 0.5, stagger: 0.02, ease: "power3.out", delay: 0.2, overwrite: "auto" });
    });

    const closeMenu = () => {
      overlay.classList.remove("active");
      gsap.to(drawer, {
        scale: 0, opacity: 0, borderRadius: "50%", duration: 0.6, ease: "power4.in", overwrite: "auto",
        onComplete: () => {
          gsap.set(menuLinksFill, { yPercent: 100, y: 0 });
          gsap.set(menuLinksOutline, { yPercent: 100, y: 0 });
        },
      });
      gsap.to(hamburger, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.inOut", overwrite: "auto" });
    };

    closeBtn?.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
  });

  return (
    <>
      <header className="main-header" ref={headerRef}>
        <div className="nav-logo">
          <img src="/assets/broetza-logo.svg" alt="Logo" />
        </div>
        <div className="nav-right-container">
          <div className="nav-items">
            <NavLink href="#menu" text="Menu" />
            <NavLink href="#visit" text="Locations" />
            <NavLink href="#story" text="Our Story" />
            <NavLink href="#reserve" text="Reserve" />
            <NavLink href="#faq" text="FAQ" />
            <NavLink href="#reserve" text="Book Now" className="reserve-trigger-btn" />
          </div>
          <div className="nav-compact-actions">
            <a href="" className="btn-get-sauce">
              <span className="btn-text-wrapper">
                <span className="btn-text-first">Get Sauce</span>
                <span className="btn-text-second">Get Sauce</span>
              </span>
            </a>
            <button className="btn-square btn-cart">
              <span className="btn-icon-wrapper">
                <span className="btn-icon-first">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-svg">
                    <path d="M3 9h18L18 20H6L3 9z"></path><path d="M9 9V5a3 3 0 0 1 6 0v4"></path>
                    <path d="M9 12v5"></path><path d="M12 12v5"></path><path d="M15 12v5"></path>
                  </svg>
                </span>
                <span className="btn-icon-second">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-svg">
                    <path d="M3 9h18L18 20H6L3 9z"></path><path d="M9 9V5a3 3 0 0 1 6 0v4"></path>
                    <path d="M9 12v5"></path><path d="M12 12v5"></path><path d="M15 12v5"></path>
                  </svg>
                </span>
              </span>
            </button>
            <button className="btn-square btn-hamburger">
              <span className="btn-icon-wrapper">
                <span className="btn-icon-first">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-svg">
                    <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </span>
                <span className="btn-icon-second">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-svg">
                    <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="menu-drawer">
        <div className="menu-header">
          <button className="btn-close-menu">
            <span className="btn-icon-wrapper">
              <span className="btn-icon-first">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
              <span className="btn-icon-second">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </span>
          </button>
        </div>
        <div className="menu-links">
          {[["#menu","Menu"],["#visit","Locations"],["#story","Our Story"],["#reserve","Reserve"],["#faq","FAQ"]].map(([href, text]) => (
            <div className="menu-link-row" key={href}>
              <NavLink href={href} text={text} />
            </div>
          ))}
        </div>
        <div className="menu-footer">
          <a href="https://instagram.com" target="_blank" className="btn-social">
            <span>Instagram</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="https://facebook.com" target="_blank" className="btn-social">
            <span>Facebook</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div className="menu-overlay"></div>
    </>
  );
}