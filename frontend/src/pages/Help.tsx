/**
 * Clinical Minimalism Help/Support Page
 * Very clean article layout, plenty of white space, soft blue accents.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import {
    Search, Book, MessageCircle, Mail, Phone,
    ChevronRight, ExternalLink, HelpCircle, FileText,
    Video, Users, Settings, Shield
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/cn';

const Help: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.help-card', {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: 'power2.out'
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    const categories = [
        { title: 'Getting Started', icon: Book, articles: 8, color: 'bg-[#D7EAFB]' },
        { title: 'Voice AI Setup', icon: Phone, articles: 12, color: 'bg-[#ECFDF5]' },
        { title: 'Appointments', icon: Users, articles: 6, color: 'bg-[#FFF7ED]' },
        { title: 'Analytics', icon: Settings, articles: 5, color: 'bg-[#FAF5FF]' },
        { title: 'HIPAA & Security', icon: Shield, articles: 10, color: 'bg-[#FEF2F2]' },
        { title: 'Billing', icon: FileText, articles: 4, color: 'bg-grey-100' },
    ];

    const popularArticles = [
        { title: 'How to set up your first AI voice agent', views: '2.4k', time: '5 min read' },
        { title: 'Integrating with your existing EHR system', views: '1.8k', time: '8 min read' },
        { title: 'Understanding HIPAA compliance for voice AI', views: '1.5k', time: '6 min read' },
        { title: 'Customizing AI responses and personality', views: '1.2k', time: '4 min read' },
        { title: 'Setting up appointment booking rules', views: '980', time: '3 min read' },
    ];

    return (
        <div ref={containerRef} className="max-w-5xl mx-auto">
            {/* Hero Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-semibold text-grey-900 tracking-tight mb-4">How can we help?</h1>
                <p className="text-grey-500 text-lg mb-8 max-w-2xl mx-auto">
                    Find answers, tutorials, and guides to get the most out of HealthVoice.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-399" />
                    <Input
                        placeholder="Search for help articles..."
                        className="pl-14 h-14 rounded-full text-base shadow-sm border-grey-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
                {[
                    { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with our support team', action: 'Start Chat' },
                    { icon: Mail, title: 'Email Support', desc: 'Get help via email', action: 'Send Email' },
                    { icon: Video, title: 'Video Tutorials', desc: 'Learn with our guides', action: 'Watch Now' },
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="help-card p-6 text-center hover:shadow-md transition-all cursor-pointer group">
                                <div className="w-14 h-14 bg-[#D7EAFB] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2BB59B] transition-colors">
                                    <Icon className="w-6 h-6 text-[#1B5E7A] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-semibold text-grey-900 mb-1">{item.title}</h3>
                                <p className="text-sm text-grey-500 mb-4">{item.desc}</p>
                                <Button variant="outline" size="sm" className="rounded-full">
                                    {item.action}
                                </Button>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Categories */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
            >
                <h2 className="text-xl font-semibold text-grey-900 mb-6">Browse by Category</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {categories.map((cat, i) => {
                        const Icon = cat.icon;
                        return (
                            <Card
                                key={i}
                                className="help-card p-5 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", cat.color)}>
                                        <Icon className="w-5 h-5 text-grey-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-grey-900 group-hover:text-[#2BB59B] transition-colors">
                                            {cat.title}
                                        </h4>
                                        <p className="text-sm text-grey-500">{cat.articles} articles</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-grey-300 group-hover:text-[#2BB59B] transition-colors" />
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </motion.div>

            {/* Popular Articles */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-grey-900">Popular Articles</h2>
                    <Button variant="ghost" size="sm">
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>

                <Card className="help-card overflow-hidden">
                    {popularArticles.map((article, i) => (
                        <div
                            key={i}
                            className={cn(
                                "p-5 flex items-center justify-between hover:bg-grey-50 transition-colors cursor-pointer group",
                                i !== popularArticles.length - 1 && "border-b border-grey-100"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-grey-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-grey-500" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-grey-900 group-hover:text-[#2BB59B] transition-colors">
                                        {article.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-sm text-grey-500 mt-1">
                                        <span>{article.time}</span>
                                        <span>•</span>
                                        <span>{article.views} views</span>
                                    </div>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-grey-300 group-hover:text-[#2BB59B] transition-colors" />
                        </div>
                    ))}
                </Card>
            </motion.div>

            {/* Contact Support */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="help-card p-8 text-center bg-gradient-to-r from-[#D7EAFB]/30 to-[#ECFDF5]/30">
                    <h3 className="text-xl font-semibold text-grey-900 mb-2">Still need help?</h3>
                    <p className="text-grey-500 mb-6 max-w-md mx-auto">
                        Our support team is available Monday–Friday, 9AM–6PM EST.
                        We typically respond within 2 hours.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Button variant="outline">
                            <Mail className="w-4 h-4 mr-2" />
                            Email Support
                        </Button>
                        <Button>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Start Live Chat
                        </Button>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Help;
