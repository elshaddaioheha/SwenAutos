

import { LegalDocumentRenderer } from '@/components/legal/LegalDocumentRenderer';

const content = `# SELLER AGREEMENT

**LAST UPDATED:** December 2, 2025

## 1. INTRODUCTION
This Agreement governs your participation as a seller on our e-commerce platform, **[SWENAUTOS.COM]**. By registering as a seller, you agree to be bound by these terms.

## 2. DEFINITIONS
- **"We" or "Us"** refers to [SWENAUTOS], a company registered in [COUNTRY].
- **"You" or "Seller"** refers to the individual or entity selling products on our platform.
- **"Products"** refers to the goods or services you sell through our platform.

## 3. SELLER ELIGIBILITY
You must:
- Be at least 18 years old
- Have a valid business registration or tax identification number
- Provide accurate and complete information about your business and products

## 4. PRODUCT LISTING AND SALES
- You are responsible for creating and maintaining accurate product listings
- You must comply with all applicable laws and regulations
- We reserve the right to remove or suspend product listings that don't meet our policies

## 5. PRICING AND PAYMENT
- You set the prices for your products
- We collect payment from buyers and remit it to you, minus our commission fees
- Payment terms and fees are detailed in the seller dashboard and subject to change with notice

## 6. SHIPPING AND DELIVERY
- You are responsible for shipping products to buyers or partnering with our logistics providers
- You must comply with our shipping and delivery policies
- We may provide shipping and logistics services, subject to separate agreement

## 7. RETURNS AND REFUNDS
- You are responsible for handling returns and refunds in accordance with our policy
- You must comply with our returns and refunds policy
- We may provide returns and refunds services, subject to separate agreement

## 8. INTELLECTUAL PROPERTY
- You own the intellectual property rights to your products and listings
- You grant us a non-exclusive license to use your content for marketing and promotional purposes

## 9. WARRANTIES AND INDEMNIFICATION
- You warrant that your products are genuine and comply with all applicable laws
- You indemnify us against claims, losses, and damages arising from your breach of this Agreement

## 10. TERMINATION
- We may terminate this Agreement at any time, with or without cause
- You may terminate this Agreement by providing written notice to us

## 11. GOVERNING LAW AND JURISDICTION
- This Agreement is governed by the laws of [COUNTRY]
- Disputes will be resolved through arbitration in accordance with [COUNTRY] arbitration laws

## 12. CONTACT US
If you have questions or concerns about this Agreement, please contact us at **[SWENAUTOS@GMAIL.COM]**.

*This Agreement is designed to comply with Nigerian and African laws, including the Nigeria Data Protection Regulation (NDPR).*`;

export default function SellerAgreementPage() {
  return <LegalDocumentRenderer title="Seller Agreement" content={content} />;
}
