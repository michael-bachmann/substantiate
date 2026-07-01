// Single source of truth for FAQ content — shared by the extension Help screen
// and the landing page. Editing a question here updates both surfaces.
// Copied verbatim from the design handoff's faq-data.js.
export const FAQS: { q: string; a: string }[] = [
  {
    q: "How does substantiate find eligible orders?",
    a: "It walks your Amazon order history and, for every order with an “FSA or HSA eligible” amount, saves a PDF receipt — downloading each one while it’s already on the invoice page.",
  },
  {
    q: "Where do the saved PDFs go?",
    a: "Straight to your Downloads folder, named like Amazon_2026-06-25_$54.86.pdf — retailer, order date, and eligible amount, so they’re easy to sort and upload.",
  },
  {
    q: "Will it submit my claims?",
    a: "No. substantiate only saves the receipts to your computer. You upload them to your reimbursement portal (Fidelity, HealthEquity, etc.) yourself — it never touches your accounts.",
  },
  {
    q: "What if an order is only partly eligible?",
    a: "The filename uses just the FSA/HSA-eligible portion — the figure your portal needs. The full order total still appears inside the PDF for your records.",
  },
  {
    q: "Why do I need to stay signed in to Amazon?",
    a: "substantiate reads your order pages right in your browser using your existing Amazon session. It never sees or stores your password.",
  },
  {
    q: "Is my data sent anywhere?",
    a: "No. Everything runs locally in your browser. Your orders, receipts, and totals are never uploaded to us or anyone else.",
  },
];
