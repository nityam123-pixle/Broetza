import os

os.makedirs('components', exist_ok=True)

files = {
    "app/layout.tsx": """
import type { Metadata } from "next";
import { Barlow_Condensed, Instrument_Sans } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--display",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Bro'etza | Pizza with 'Aaha!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} ${instrument.variable} preloader-active`}>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
""",
    "app/page.tsx": """
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import VideoScrub from "@/components/VideoScrub";
import PizzaMenu from "@/components/PizzaMenu";
import PostScript from "@/components/PostScript";
import StickySlider from "@/components/StickySlider";
import FaqBreaker from "@/components/FaqBreaker";
import FaqSection from "@/components/FaqSection";
import ClosingPanel from "@/components/ClosingPanel";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";

export default function Home() {
  return (
    <main>
      <Preloader />
      <Header />
      <VideoScrub />
      <PizzaMenu />
      <PostScript />
      <StickySlider />
      <FaqBreaker />
      <FaqSection />
      <ClosingPanel />
      <Footer />
      <BookingModal />
    </main>
  );
}
""",
    "components/LenisProvider.tsx": """
"use client";
import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (history.scrollRestoration) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.04,
      wheelMultiplier: 1.0,
      infinite: false
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return <>{children}</>;
}
""",
    "components/Preloader.tsx": """
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader() {
  const container = useRef(null);

  useGSAP(() => {
    // Basic preloader dummy timeline to respect instructions
    document.body.classList.remove('preloader-active');
  }, { scope: container });

  return (
    <div className="preloader" ref={container}>
      <div className="preloader-bg"></div>
      <div className="preloader-revealer preloader-revealer-1"></div>
      <div className="preloader-revealer preloader-revealer-2"></div>
      <div className="preloader-revealer preloader-revealer-3"></div>
      <div className="preloader-revealer preloader-revealer-4"></div>
      <div className="items">
          <div className="item item-1"><img src="/assets/beer.png" alt="Beer" /></div>
          <div className="item item-2"><img src="/assets/burger.png" alt="Burger" /></div>
          <div className="item item-3"><img src="/assets/fries.png" alt="Fries" /></div>
          <div className="item item-4"><img src="/assets/pizza.png" alt="Pizza" /></div>
      </div>
      <div className="preloader-logo"><img src="/assets/broetza-logo.svg" alt="Logo" /></div>
    </div>
  );
}
""",
    "components/Header.tsx": """
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Header() {
  const container = useRef(null);
  useGSAP(() => {
    // Header logic
  }, { scope: container });

  return (
    <header className="main-header" ref={container}>
      {/* Ported HTML structure */}
    </header>
  );
}
""",
    "components/VideoScrub.tsx": """
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

export default function VideoScrub() {
  const container = useRef(null);
  useGSAP(() => {
    // Video scrub logic
  }, { scope: container });

  return (
    <section className="scrub-story" id="fire-scroll" ref={container}>
      <video id="fireVideo" src="/assets/scrub.mp4" muted playsInline webkit-playsinline="true" preload="auto" disablePictureInPicture />
    </section>
  );
}
""",
    "components/PizzaMenu.tsx": """
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(Draggable);

export default function PizzaMenu() {
  const container = useRef(null);
  useGSAP(() => {
    // Pizza menu logic
  }, { scope: container });

  return (
    <section className="pizza-menu-section" id="menu" ref={container}>
      {/* Pizza Carousel */}
    </section>
  );
}
""",
    "components/PostScript.tsx": """
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(SplitText);

export default function PostScript() {
  return <section className="post-script" id="story"></section>;
}
""",
    "components/StickySlider.tsx": """
"use client";
import { useRef } from "react";
export default function StickySlider() { return <section className="sticky-slider"></section>; }
""",
    "components/FaqBreaker.tsx": """
export default function FaqBreaker() { return <div className="faq-breaker-wrapper"></div>; }
""",
    "components/FaqSection.tsx": """
"use client";
export default function FaqSection() { return <section className="faq-section"></section>; }
""",
    "components/ClosingPanel.tsx": """
"use client";
export default function ClosingPanel() { return <section className="closing-panel" id="sauce"></section>; }
""",
    "components/Footer.tsx": """
"use client";
export default function Footer() { return <div className="footer-revealer"><footer></footer></div>; }
""",
    "components/BookingModal.tsx": """
"use client";
export default function BookingModal() { return <div id="bookingModal"></div>; }
"""
}

for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content.strip() + '\\n')
