import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';

export default function DashboardLayout({ children }) {
    return (
        <div className='grid min-h-dvh grid-rows-[auto_1fr_auto]'>
            <Header />
            <main className="flex flex-col relative py-6 px-4 md:px-10 container mx-auto min-h-[95dvh]">
                {children}
            </main>
            <Footer />
        </div>
    );
}
