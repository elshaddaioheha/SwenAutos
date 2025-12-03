

import { LegalDocumentRenderer } from '@/components/legal/LegalDocumentRenderer';

const content = `# TERMS OF SERVICE

**LAST UPDATED:** December 2, 2025

## 1. INTRODUCTION
These Terms govern your use of **[SWENAUTOS]**'s website and services. By using our website and services, you agree to be bound by these Terms.

## 2. DEFINITIONS
- **"We" or "Us"** refers to [SWENAUTOS], a company registered in [COUNTRY].
- **"You" or "User"** refers to the individual or entity using our website and services.
- **"Products"** refers to the goods and services offered for sale through our website.

## 3. USE OF OUR WEBSITE AND SERVICES
- You must be at least 18 years old to use our website and services.
- You're responsible for maintaining the confidentiality of your account credentials.
- You agree to use our website and services only for lawful purposes.

## 4. PRODUCTS AND PAYMENTS
- We offer Products for sale through our website, subject to availability.
- Prices are subject to change without notice.
- Payment must be made in Nigerian Naira (NGN) or accepted cryptocurrency using our accepted payment methods.

## 5. INTELLECTUAL PROPERTY
- Our website and services, including content and trademarks, are owned by [SWENAUTOS] or its licensors.
- You cannot reproduce, distribute, or modify our website or services without our express written consent.

## 6. LIABILITY AND DISCLAIMERS
- We make no warranties regarding our website and services, including merchantability and fitness for a particular purpose.
- We are not liable for damages or losses arising from your use of our website and services.

## 7. TERMINATION
- We may terminate or suspend your access to our website and services at any time.
- You must cease using our website and services immediately upon termination.

## 8. GOVERNING LAW AND JURISDICTION
- These Terms are governed by the laws of [COUNTRY].
- Disputes will be resolved through arbitration in accordance with [COUNTRY] arbitration laws.

## 9. CONTACT US
If you have questions or concerns, please contact us at **[SWENAUTOS@GMAIL.COM]**.

*This Agreement is designed to comply with Nigerian and African laws including the Nigeria Data Protection Regulation (NDPR).*`;

export default function TermsOfServicePage() {
  return <LegalDocumentRenderer title="Terms of Service" content={content} />;
}
