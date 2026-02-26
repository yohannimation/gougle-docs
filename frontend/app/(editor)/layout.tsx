export default function EditorLayout({ children }) {
    return (
        <>
            <main className="py-6 px-10 container mx-auto flex-1 min-h-0 overflow-hidden">
                {children}
            </main>
        </>
    );
}
