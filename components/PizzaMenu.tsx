"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Draggable, useGSAP);

const pizzas = [
  { name: "Margherita Supreme", desc: "The classic you love, elevated with fresh basil and mozzarella.", price: "Small · Medium · Large — ₹299" },
  { name: "Farmhouse Delight", desc: "Loaded with fresh veggies, mushrooms, and golden corn.", price: "Small · Medium · Large — ₹349" },
  { name: "Spicy Paneer", desc: "Tandoori paneer chunks with red paprika and crisp capsicum.", price: "Small · Medium · Large — ₹399" },
  { name: "Veg Extravaganza", desc: "Black olives, capsicum, onion, mushroom, corn, jalapeño.", price: "Small · Medium · Large — ₹449" },
];

const pizzaImages = ["/assets/pizza.png", "/assets/pizza2.png", "/assets/pizza3.png", "/assets/pizza4.png"];

export default function PizzaMenu() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useGSAP(() => {
    const container = document.querySelector(".pizza-carousel-container") as HTMLElement;
    const slides = document.querySelectorAll<HTMLElement>(".pizza-slide");
    const nameEl = document.getElementById("pizza-name");
    const descEl = document.getElementById("pizza-desc");
    const accentEl = document.getElementById("pizza-accent");
    const pricingEl = document.getElementById("pizza-pricing");
    const interactiveZone = document.querySelector(".pizza-interactive-zone") as HTMLElement;
    const customCursor = document.querySelector(".drag-cursor") as HTMLElement;

    if (!interactiveZone || !container) return;

    // Custom cursor
    const xTo = gsap.quickTo(customCursor, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(customCursor, "y", { duration: 0.4, ease: "power3" });
    interactiveZone.addEventListener("mousemove", (e) => { xTo(e.clientX - 50); yTo(e.clientY - 50); });
    interactiveZone.addEventListener("mouseenter", () => gsap.to(customCursor, { opacity: 1, scale: 1, duration: 0.3 }));
    interactiveZone.addEventListener("mouseleave", () => gsap.to(customCursor, { opacity: 0, scale: 0, duration: 0.3 }));

    const proxy = document.createElement("div");
    let startRotation = 0;
    let currentRotation = 0;
    let idx = 0;
    const total = pizzas.length;

    const updateContent = (index: number) => {
      const p = pizzas[index];
      gsap.to([nameEl, descEl, accentEl, pricingEl], {
        y: -10, opacity: 0, duration: 0.2,
        onComplete: () => {
          if (nameEl) nameEl.textContent = p.name;
          if (descEl) descEl.textContent = p.desc;
          if (accentEl) accentEl.textContent = p.name;
          if (pricingEl) pricingEl.textContent = p.price;
          gsap.fromTo([nameEl, descEl, accentEl, pricingEl], { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05 });
        },
      });
      slides.forEach((slide, i) => gsap.to(slide, { opacity: i === index ? 1 : 0, duration: 0.5 }));
    };

    Draggable.create(proxy, {
      type: "x",
      trigger: interactiveZone,
      onPressInit() { startRotation = currentRotation; },
      onDrag() {
        const rotationDelta = (this.x - this.startX) * 0.4;
        currentRotation = startRotation + rotationDelta;
        gsap.set(container, { rotation: currentRotation });
      },
      onDragEnd() {
        const dx = this.x - this.startX;
        if (dx > 100) {
          idx = (idx - 1 + total) % total;
          currentRotation += 45;
          gsap.to(container, { rotation: currentRotation, duration: 0.6, ease: "power2.out" });
          updateContent(idx);
        } else if (dx < -100) {
          idx = (idx + 1) % total;
          currentRotation -= 45;
          gsap.to(container, { rotation: currentRotation, duration: 0.6, ease: "power2.out" });
          updateContent(idx);
        } else {
          currentRotation = startRotation;
          gsap.to(container, { rotation: startRotation, duration: 0.6, ease: "back.out(1.5)" });
        }
        gsap.set(proxy, { x: 0 });
      },
    });
  });

  return (
    <section className="pizza-menu-section" id="menu" ref={sectionRef}>
      <div className="menu-top-row">
        <div className="menu-text-left">
          <h2 id="pizza-name">{pizzas[0].name}</h2>
          <p id="pizza-desc">{pizzas[0].desc}</p>
        </div>
        <div className="menu-text-right">
          <div className="pizza-name-accent" id="pizza-accent">{pizzas[0].name}</div>
          <div className="pizza-pricing" id="pizza-pricing">{pizzas[0].price}</div>
        </div>
      </div>

      <div className="pizza-interactive-zone">
        <div className="pizza-carousel-container">
          {pizzaImages.map((src, i) => (
            <img key={src} src={src} className={`pizza-slide${i === 0 ? " active" : ""}`} alt={pizzas[i].name} />
          ))}
        </div>
        <div className="drag-cursor">
          <span className="cursor-arrow left">←</span>
          <span className="cursor-text">DRAG</span>
          <span className="cursor-arrow right">→</span>
        </div>
      </div>
    </section>
  );
}