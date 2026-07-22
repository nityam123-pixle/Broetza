"use client";
import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function BookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const openModal = () => {
    setIsOpen(true);
    requestAnimationFrame(() => {
      const formElements = modalRef.current?.querySelectorAll(".booking-modal-header > *, .form-group, .submit-booking-btn");
      if (formElements) {
        gsap.set(formElements, { opacity: 0, y: 15 });
        gsap.to(formElements, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", delay: 0.2 });
      }
    });
  };
  const closeModal = () => setIsOpen(false);

  // Wire up reserve-trigger-btn clicks globally
  useGSAP(() => {
    const triggers = document.querySelectorAll(".reserve-trigger-btn");
    const handler = (e: Event) => { e.preventDefault(); openModal(); };
    triggers.forEach((t) => t.addEventListener("click", handler));
    const keydown = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", keydown);
    return () => {
      triggers.forEach((t) => t.removeEventListener("click", handler));
      window.removeEventListener("keydown", keydown);
    };
  });

  return (
    <div
      className={`booking-modal${isOpen ? " is-active" : ""}`}
      id="bookingModal"
      aria-hidden={!isOpen}
      role="dialog"
      ref={modalRef}
    >
      <div className="booking-modal-overlay" onClick={closeModal}></div>
      <div className="booking-modal-content">
        <button className="booking-modal-close" aria-label="Close modal" onClick={closeModal}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="booking-form-wrapper">
          <div className="booking-modal-header">
            <h2>Order Online</h2>
            <p>Direct online ordering is coming soon! Please check back later or order via Zomato/Swiggy.</p>
          </div>
          <form
            className="booking-form"
            id="bookingForm"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Table reserved successfully! We look forward to hosting you.");
              closeModal();
              (e.target as HTMLFormElement).reset();
            }}
          >
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="booking-date">Date</label>
                <input type="date" id="booking-date" required />
              </div>
              <div className="form-group">
                <label htmlFor="booking-time">Time</label>
                <select id="booking-time" required>
                  <option value="">Select time</option>
                  {["5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM","8:30 PM","9:00 PM","9:30 PM"].map((t, i) => (
                    <option key={i} value={`${17 + Math.floor(i/2)}:${i % 2 === 0 ? "00" : "30"}`}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="booking-guests">Guests</label>
                <select id="booking-guests" required>
                  {[2,3,4,5,6].map((n) => <option key={n} value={n}>{n} People</option>)}
                  <option value="7">7+ (Call us)</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="booking-name">Name</label>
                <input type="text" id="booking-name" placeholder="Your name" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="booking-email">Email</label>
              <input type="email" id="booking-email" placeholder="hello@example.com" required />
            </div>
            <button type="submit" className="btn-get-sauce submit-booking-btn">
              <span className="btn-text-wrapper">
                <span className="btn-text-first">Submit</span>
                <span className="btn-text-second">Submit</span>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}