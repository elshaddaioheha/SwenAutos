import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[#111827] text-white py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Column 1 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">About SwenAutos</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                            <li><Link href="/trust" className="hover:text-white transition-colors">Trust & Safety</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Support</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/dispute" className="hover:text-white transition-colors">Dispute Resolution</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Legal</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/cookie" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                            <li><Link href="/seller-agreement" className="hover:text-white transition-colors">Seller Agreement</Link></li>
                        </ul>
                    </div>

                    {/* Column 4 */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Follow Us</h3>
                        <div className="flex space-x-4 text-gray-400">
                            <Link href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></Link>
                            <Link href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} SwenAutos. All rights reserved. Built for Igbo auto-parts traders.</p>
                </div>
            </div>
        </footer>
    );
}
