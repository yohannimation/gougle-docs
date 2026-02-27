export default function EditorLayout({ children }) {
    return (
        <>
            <main className="h-screen py-6 px-10 container mx-auto flex flex-col min-h-0 overflow-hidden">
                {children}
            </main>
        </>
    );
}
