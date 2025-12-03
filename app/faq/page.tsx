

import { LegalDocumentRenderer } from '@/components/legal/LegalDocumentRenderer';

const content = `# FREQUENTLY ASKED QUESTIONS (FAQ)

## Get Quick Answers to Common Questions

Browse our FAQ section for answers to common questions about ordering, payment, shipping, returns, and more.

## ORDERS AND PAYMENTS

**Q: How do I place an order?**
A: Simply browse our products, add them to your cart, and follow the checkout process.

**Q: What payment methods do you accept?**
A: We accept mobile money, credit cards, cryptocurrency, and bank transfers.

**Q: Can I cancel or modify my order?**
A: Please contact us as soon as possible if you need to make changes to your order. Cancellations may be possible depending on order status.

## SHIPPING AND DELIVERY

**Q: How long does shipping take?**
A: Shipping times vary depending on your location and the shipping method selected. You'll receive an estimated delivery date during checkout.

**Q: Can I track my order?**
A: Yes, we'll send you a tracking number once your order ships so you can monitor its progress.

**Q: What if I'm not available to receive my order?**
A: We'll leave a delivery note with instructions, or you can arrange delivery with someone you authorize using the verification details we provide.

## RETURNS AND REFUNDS

**Q: How do I initiate a return or exchange?**
A: Contact our customer support team within [NUMBER] days of receiving your order for assistance with returns and exchanges.

**Q: When can I expect a refund?**
A: Refunds are processed within 5-7 business days after we receive and verify your returned item.

## ACCOUNT AND SECURITY

**Q: How do I reset my password?**
A: Click "Forgot Password" on our login page to reset your password. You'll receive a reset link via email.

**Q: Is my payment information secure?**
A: Yes, we use industry-standard encryption and comply with PCI-DSS standards to protect your payment information.

## MORE QUESTIONS?

Can't find what you're looking for? Contact our customer support team for help:

**Email:** [SWENAUTOS@GMAIL.COM]
**Live Chat:** Available on our website`;

export default function FAQPage() {
  return <LegalDocumentRenderer title="FAQ" content={content} />;
}
