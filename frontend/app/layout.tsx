import type { Metadata } from 'next';
import { Raleway, Lexend } from 'next/font/google';
import './globals.css';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

const raleway = Raleway({
    variable: '--font-raleway',
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
                className={`${raleway.variable} ${lexend.variable} antialiased h-dvh flex flex-col`}
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
