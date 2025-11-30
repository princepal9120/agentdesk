'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FooterCTA() {
    return (
        <footer className="bg-slate-900 text-white pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                {/* CTA Section */}
                <div className="relative rounded-3xl bg-gradient-to-r from-blue-600 to-teal-500 p-12 md:p-20 text-center overflow-hidden mb-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                            Start saving hours of admin work every week.
                        </h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
                            Join 500+ forward-thinking practices using MedVoice to automate scheduling and delight patients.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button className="h-14 px-8 rounded-full bg-white text-blue-600 hover:bg-blue-50 font-bold text-lg shadow-xl">
                                Start Free Trial
                            </Button>
                            <Button variant="outline" className="h-14 px-8 rounded-full border-blue-200 text-white hover:bg-blue-700 hover:text-white font-medium text-lg bg-transparent">
                                Talk to Sales
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="grid md:grid-cols-4 gap-12 border-t border-slate-800 pt-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <img
                                src="/darklogo.png"
                                alt="MedVoice Logo"
                                className="h-8 w-auto"
                            />
                            <span className="text-xl font-bold">MedVoice</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            AI-powered appointment scheduling for modern healthcare practices.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Case Studies</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Reviews</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">HIPAA Compliance</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
                    © {new Date().getFullYear()} MedVoice Scheduler. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
