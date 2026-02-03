import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { EarthIcon, Github, PlusIcon } from "lucide-react"

export default function Header() {
    return (
        <header className="flex justify-between items-center py-4 px-10 border-b-1">
            <h1>Gougle doc</h1>
            <div className="flex items-end gap-2">
                <Link href='docs' className="flex items-center gap-2">
                    <Button className="bg-cyan-300 text-cyan-800 hover:bg-cyan-500 hover:text-white">
                        <PlusIcon /> New Doc
                    </Button>
                </Link>
                
                <ButtonGroup>
                    <Button size="icon" variant="outline">
                        <Link href='https://github.com/yohannimation' target="_blank"><Github /></Link>
                    </Button>
                    <Button size="icon" variant="outline">
                        <Link href='https://yohannimation.fr' target="_blank"><EarthIcon /></Link>
                    </Button>
                </ButtonGroup>
            </div>
        </header>
    );
}
