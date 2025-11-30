import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MedVoice - AI Voice Scheduling for Healthcare | HIPAA Compliant',
    description:
        'Automate your clinic\'s appointments with MedVoice\'s AI voice agent. HIPAA compliant, Epic & Athena integration. Save 40+ hours/month. Start free trial.',
    keywords: [
        'healthcare scheduling',
        'AI receptionist',
        'medical appointment booking',
        'HIPAA compliant',
        'EHR integration',
        'Epic integration',
        'Athena integration',
        'voice AI',
        'clinic automation',
        'patient scheduling',
        'medical practice management',
        'appointment reminders',
        'no-show reduction',
    ],
    openGraph: {
        title: 'MedVoice - AI Voice Scheduling for Healthcare',
        description:
            'Never miss a call—automate your clinic\'s appointments, save thousands in missed revenue, and reduce staff burnout with MedVoice\'s voice AI.',
        type: 'website',
        locale: 'en_US',
        siteName: 'MedVoice',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MedVoice - AI Voice Scheduling for Healthcare',
        description:
            'Automate appointments, reduce no-shows by 25%, save 40+ staff hours/month. HIPAA compliant. Start free trial.',
    },
    robots: {
        index: true,
        follow: true,
    },
};
