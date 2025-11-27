'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
    {
        question: "Is MedVoice HIPAA compliant?",
        answer: "Yes, absolutely. MedVoice is fully HIPAA compliant. All data is encrypted at rest and in transit, and we sign a Business Associate Agreement (BAA) with every healthcare provider."
    },
    {
        question: "Does it integrate with my existing EHR?",
        answer: "We support integrations with major EHR systems including Epic, Cerner, AthenaHealth, and DrChrono. Our team handles the setup process to ensure seamless calendar syncing."
    },
    {
        question: "What happens if the AI doesn't understand a patient?",
        answer: "Our AI is trained on millions of healthcare conversations, but if it encounters a complex situation it can't handle, it gracefully transfers the call to your front desk or takes a detailed message for your review."
    },
    {
        question: "Can I customize the AI's voice and script?",
        answer: "Yes! You can choose from our library of professional voices and fully customize the greeting, screening questions, and appointment rules to match your practice's specific needs."
    },
    {
        question: "Is there a contract or setup fee?",
        answer: "We offer month-to-month plans with no long-term contracts. There is a one-time onboarding fee which covers custom script configuration and EHR integration setup."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600">
                        Everything you need to know about MedVoice.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:border-blue-200 hover:shadow-sm"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-semibold text-slate-900 text-lg pr-8">
                                    {faq.question}
                                </span>
                                <span className={cn(
                                    "p-2 rounded-full transition-colors duration-300",
                                    openIndex === index ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"
                                )}>
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>

                            <div
                                className={cn(
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                )}
                            >
                                <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
