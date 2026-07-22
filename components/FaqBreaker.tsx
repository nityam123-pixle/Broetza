export default function FaqBreaker() {
    const text =
        "• PIZZA WITH 'AAHA! • 100% VEG • AHMEDABAD BORN • FRESH DOUGH DAILY • ZOMATO & SWIGGY ";
    return (
        <div className="faq-breaker-wrapper">
            <div className="faq-breaker bg-white">
                <div className="breaker-track">
                    <span>
                        {text}
                        {text}
                    </span>
                    <span>
                        {text}
                        {text}
                    </span>
                </div>
            </div>
        </div>
    );
}
