import type { Metadata } from 'next';
import { Geist, Geist_Mono, Lexend } from 'next/font/google';
import './globals.css';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const lexend = Lexend({
    variable: '--font-lexend',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Gougle Docs',
    description: 'A cooperative editor like Google Docs',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} antialiased h-dvh flex flex-col`}
            >
                <TooltipProvider>
                    {children}
                    <Toaster
                        position="top-center"
                        richColors
                        expand={false}
                        duration={8000}
                    />
                </TooltipProvider>
            </body>
        </html>
    );
}
