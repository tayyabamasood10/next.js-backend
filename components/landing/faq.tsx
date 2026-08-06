"use client";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What platforms do you support?",
    answer: "We support Shopify, WooCommerce, BigCommerce, and custom stores via API. Our integration takes less than 5 minutes.",
  },
  {
    question: "How does AI revenue recovery work?",
    answer: "Our AI analyzes your store data, customer behavior, and transaction patterns to identify revenue leaks and provide actionable recommendations.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use enterprise-grade encryption and never share your data with third parties. We are SOC 2 compliant.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time with no questions asked. Your data remains accessible for 30 days.",
  },
  {
    question: "How long until I see results?",
    answer: "Most customers see insights within 24 hours of connecting their store. Revenue improvements typically begin within the first week.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 bg-accent/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about AI Revenue Recovery.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: FAQItem) {
  return (
    <details className="group rounded-[16px] border border-border bg-card shadow-sm">
      <summary className="flex cursor-pointer items-center justify-between p-6 text-left font-medium text-foreground list-none">
        <span className="pr-4">{question}</span>
        <svg
          className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">
        {answer}
      </div>
    </details>
  );
}
