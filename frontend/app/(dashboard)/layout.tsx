import Header from '@/components/Header/Header';

export default function DashboardLayout({ children }) {
    return (
        <>
            <Header />
            <main className="py-6 px-10 container mx-auto">{children}</main>
        </>
    );
}
