"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const slides = [
  { title: "Bro'etza Signatures", image: "/assets/img1.png", url: "#" },
  { title: "Domed Sanctuary", image: "/assets/img2.png", url: "#" },
  { title: "Courtyard Retreat", image: "/assets/img3.png", url: "#" },
  { title: "Arched Corridor", image: "/assets/img4.png", url: "#" },
  { title: "Illuminated Grotto", image: "/assets/img5.png", url: "#" },
];

export default function StickySlider() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const slideImages = document.querySelector(".slide-images") as HTMLElement;
    const titleElement = document.getElementById("title-text");
    const exploreLink = document.querySelector(".slide-link a") as HTMLAnchorElement;
    if (!slideImages || !titleElement || !exploreLink) return;

    const totalSlides = slides.length;
    const stripsCount = 25;
    let currentTitleIndex = 0;

    const firstSlideImg = document.querySelector("#img-1 img") as HTMLImageElement;
    if (firstSlideImg) firstSlideImg.style.transform = "scale(1.25)";
    const firstSlideImgSetter = gsap.quickSetter(firstSlideImg, "transform");
    let firstSlideLastScale: number | null = null;

    const slideData: {
      imgContainer: HTMLElement;
      imgScaleSetter: ReturnType<typeof gsap.quickSetter>;
      lastScale: number | null;
      strips: { setter: ReturnType<typeof gsap.quickSetter>; upperBound: number; lowerBound: number; bottomInset: number; delay: number; lastProgress: number }[];
      transitionIndex: number;
      state: string;
    }[] = [];

    for (let i = 1; i < totalSlides; i++) {
      const imgContainer = document.createElement("div");
      imgContainer.className = "img-container";
      imgContainer.id = `img-container-${i + 1}`;
      imgContainer.style.opacity = "1";
      const stripsArray: typeof slideData[0]["strips"] = [];
      const imagesArray: HTMLImageElement[] = [];

      for (let j = 0; j < stripsCount; j++) {
        const strip = document.createElement("div");
        strip.className = "strip";
        const img = document.createElement("img");
        img.src = slides[i].image;
        img.alt = slides[i].title;
        img.style.transform = "scale(1.25)";
        const stripPositionFromBottom = stripsCount - j - 1;
        const stripLowerBound = (stripPositionFromBottom + 1) * (100 / stripsCount);
        const stripUpperBound = stripPositionFromBottom * (100 / stripsCount);
        strip.style.clipPath = `inset(${stripLowerBound}% 0% ${100 - stripLowerBound}% 0%)`;
        strip.appendChild(img);
        imgContainer.appendChild(strip);
        stripsArray.push({ setter: gsap.quickSetter(strip, "clipPath"), upperBound: stripUpperBound, lowerBound: stripLowerBound, bottomInset: 100 - stripLowerBound, delay: (j / stripsCount) * 0.5, lastProgress: -1 });
        imagesArray.push(img);
      }
      slideImages.appendChild(imgContainer);
      slideData.push({ imgContainer, imgScaleSetter: gsap.quickSetter(imagesArray, "transform"), lastScale: null, strips: stripsArray, transitionIndex: i - 1, state: "closed" });
    }

    const transitionCount = totalSlides - 1;
    const scrollDistancePerTransition = 400;
    const initialScrollDelay = 150;
    const finalScrollDelay = 150;
    const totalScrollDistance = transitionCount * scrollDistancePerTransition + initialScrollDelay + finalScrollDelay;

    const transitionRanges: { transition: number; startVh: number; endVh: number; startPercent: number; endPercent: number }[] = [];
    let currentScrollPosition = initialScrollDelay;
    for (let i = 0; i < transitionCount; i++) {
      const start = currentScrollPosition;
      const end = start + scrollDistancePerTransition;
      transitionRanges.push({ transition: 1, startVh: start, endVh: end, startPercent: start / totalScrollDistance, endPercent: end / totalScrollDistance });
      currentScrollPosition = end;
    }

    const calculateImageProgress = (scrollProgress: number) => {
      if (scrollProgress < transitionRanges[0].startPercent) return 0;
      if (scrollProgress > transitionRanges[transitionRanges.length - 1].endPercent) return transitionRanges.length;
      let imageProgress = 0;
      for (let i = 0; i < transitionRanges.length; i++) {
        const range = transitionRanges[i];
        if (scrollProgress >= range.startPercent && scrollProgress <= range.endPercent) {
          imageProgress = i + (scrollProgress - range.startPercent) / (range.endPercent - range.startPercent);
          break;
        } else if (scrollProgress > range.endPercent) { imageProgress = i + 1; }
      }
      return imageProgress;
    };

    const getScaleForImage = (imageIndex: number, currentImageIndex: number, progress: number) => {
      if (imageIndex > currentImageIndex) return 1.25;
      if (imageIndex < currentImageIndex - 1) return 1;
      const totalProgress = imageIndex === currentImageIndex ? progress : 1 + progress;
      return 1.25 - (0.25 * totalProgress) / 2;
    };

    const animateTitleChange = (index: number, direction: string) => {
      if (index === currentTitleIndex) return;
      if (index < 0 || index >= slides.length) return;
      currentTitleIndex = index;
      const newTitle = slides[index].title;
      const newUrl = slides[index].url;
      const outY = direction === "down" ? "-120" : "120";
      const inY = direction === "down" ? "120" : "-120";
      gsap.killTweensOf(titleElement);
      exploreLink.href = newUrl;
      gsap.to(titleElement, { y: outY, duration: 0.25, ease: "power2.in", onComplete: () => {
        titleElement!.textContent = newTitle;
        gsap.set(titleElement, { y: inY });
        gsap.to(titleElement, { y: "0%", duration: 0.25, ease: "power2.out" });
      }});
    };

    const getTitleIndexForProgress = (imageProgress: number) => {
      const imageIndex = Math.floor(imageProgress);
      const imageSpecificProgress = imageProgress - imageIndex;
      return imageSpecificProgress >= 0.5 ? Math.min(imageIndex + 1, slides.length - 1) : imageIndex;
    };

    let lastImageProgress = 0;

    ScrollTrigger.create({
      trigger: ".sticky-slider", start: "top top", end: `+=${totalScrollDistance}`,
      pin: true, pinSpacing: true, scrub: 1, invalidateOnRefresh: true,
      onUpdate: (self) => {
        const imageProgress = calculateImageProgress(self.progress);
        const scrollDirection = imageProgress > lastImageProgress ? "down" : "up";
        const currentImageIndex = Math.floor(imageProgress);
        const imageSpecificProgress = imageProgress - currentImageIndex;
        const correctTitleIndex = getTitleIndexForProgress(imageProgress);
        if (correctTitleIndex !== currentTitleIndex) animateTitleChange(correctTitleIndex, scrollDirection);

        const firstSlideImgScale = getScaleForImage(0, currentImageIndex, imageSpecificProgress);
        if (firstSlideLastScale !== firstSlideImgScale) { firstSlideImgSetter(`scale(${firstSlideImgScale})`); firstSlideLastScale = firstSlideImgScale; }

        for (const slide of slideData) {
          const { strips, imgScaleSetter, transitionIndex } = slide;
          if (transitionIndex < currentImageIndex) {
            if (slide.state !== "open") { strips.forEach(s => { if (s.lastProgress !== 1) { s.setter(`inset(${s.upperBound - 0.1}% 0% ${s.bottomInset}% 0%)`); s.lastProgress = 1; } }); slide.state = "open"; }
          } else if (transitionIndex === currentImageIndex) {
            slide.state = "animating";
            strips.forEach(s => { const adj = Math.max(0, Math.min(1, (imageSpecificProgress - s.delay) * 2)); if (s.lastProgress !== adj) { const ub = s.lowerBound - (s.lowerBound - (s.upperBound - 0.1)) * adj; s.setter(`inset(${ub}% 0% ${s.bottomInset}% 0%)`); s.lastProgress = adj; } });
          } else {
            if (slide.state !== "closed") { strips.forEach(s => { if (s.lastProgress !== 0) { s.setter(`inset(${s.lowerBound}% 0% ${s.bottomInset}% 0%)`); s.lastProgress = 0; } }); slide.state = "closed"; }
          }
          const imgScale = getScaleForImage(transitionIndex, currentImageIndex, imageSpecificProgress);
          if (slide.lastScale !== imgScale) { imgScaleSetter(`scale(${imgScale})`); slide.lastScale = imgScale; }
        }
        lastImageProgress = imageProgress;
      },
    });
  });

  return (
    <section className="sticky-slider" ref={sectionRef}>
      <div className="slide-images">
        <div className="img" id="img-1">
          <img src="/assets/img1.png" alt="" />
        </div>
      </div>
      <div className="slide-info">
        <div className="slide-title-prefix"><p>Menu Highlights</p></div>
        <div className="slide-title"><p id="title-text">Bro&apos;etza Signatures</p></div>
        <div className="slide-link"><a href="#">Explore &#8599;</a></div>
      </div>
    </section>
  );
}