export default function EditorLayout({ children }) {
    return (
        <>
            <main className="h-screen p-3 md:px-10 container mx-auto flex flex-col min-h-0 max-w-8xl overflow-hidden">
                {children}
            </main>
        </>
    );
}
