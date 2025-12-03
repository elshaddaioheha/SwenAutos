

import { LegalDocumentRenderer } from '@/components/legal/LegalDocumentRenderer';

const content = `# PRIVACY POLICY

**LAST UPDATED:** December 2, 2025

## 1. INTRODUCTION
We respect your right to privacy and are committed to protecting your personal data. This policy explains how we collect, use, and protect your information.

## 2. SCOPE 
This policy applies to our website, **[SWENAUTOS.COM]**, and all services provided through it.

## 3. DEFINITIONS
- **"We" or "Us"** refers to [SWENAUTOS], a company registered in [COUNTRY].
- **"You" or "User"** refers to the individual or entity using our website and services.
- **"Personal Data"** means any information that can identify you, such as name, email, and address.

## 4. COLLECTION OF PERSONAL DATA
We collect Personal Data:
- When you create an account or make a purchase
- When you interact with our website or services
- From cookies and tracking technologies

## 5. TYPES OF PERSONAL DATA COLLECTED
- Contact information (name, email, phone number, address)
- Payment information (card details, billing address)
- Order history and preferences
- Device and usage data (IP address, browser type, location)

## 6. USE OF PERSONAL DATA
We use Personal Data to:
- Process orders and payments
- Improve our services and website
- Communicate with you about orders, promotions, and updates
- Protect against fraud and unauthorized access

## 7. SHARING OF PERSONAL DATA
We share Personal Data with:
- Payment processors and financial institutions
- Shipping and delivery partners
- Service providers (e.g., analytics, marketing)
- Law enforcement or regulatory authorities (if required by law)

## 8. DATA SECURITY
We implement reasonable security measures to protect your Personal Data, including encryption, access controls, and regular monitoring.

## 9. DATA RETENTION
We retain Personal Data for as long as necessary to fulfill the purposes outlined in this policy.

## 10. YOUR RIGHTS
You have the right to:
- Access, correct, or delete your Personal Data
- Object to processing or restrict use of your Personal Data
- Withdraw consent for marketing communications

## 11. COOKIES AND TRACKING
We use cookies and tracking technologies to improve your experience and analyze website usage.

## 12. CHILDREN'S PRIVACY
Our website is not intended for children under 16. We don't knowingly collect Personal Data from children.

## 13. INTERNATIONAL DATA TRANSFERS
Your Personal Data may be transferred to and processed in countries other than your own, in accordance with applicable laws.

## 14. COMPLAINTS
If you have concerns about our handling of your Personal Data, please contact us at **[SWENAUTOS@GMAIL.COM]**.

## 15. CHANGES TO THIS POLICY
We may update this policy from time to time. Changes will be effective immediately upon posting.

## 16. CONTACT US
For questions or concerns about this policy, please contact us at:
**[SWENAUTOS@GMAIL.COM]**

*This policy is designed to comply with Nigerian and African data protection laws, including the Nigeria Data Protection Regulation (NDPR) and the African Union Convention on Cyber Security and Personal Data Protection.*`;

export default function PrivacyPolicyPage() {
  return <LegalDocumentRenderer title="Privacy Policy" content={content} />;
}
