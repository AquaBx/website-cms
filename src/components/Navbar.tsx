'use client'

import { m } from "@/paraglide/messages";
import { House, Briefcase, Image, Music, FileText, Flag, Newspaper } from "@steeze-ui/lucide-icons";
import Icon from "@/components/Icon";
import { usePathname } from 'next/navigation'

const links = [
    { href: "/", label: m.home, icon: House },
    { href: "/timeline", label: m.timeline, icon: Flag },
    { href: "/blog", label: m.blog, icon: Newspaper },
    { href: "/projects", label: m.projects, icon: Briefcase },
    // { href: "/gallery", label: m.gallery, icon: Image },
    // { href: "/music", label: m.music, icon: Music },
    { href: "/cv", label: m.cv, icon: FileText },
];

export default function () {
    return <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 p-2 bg-white/70 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl z-50 flex gap-1">
        {
            links.map(link => {
                const active = usePathname() === link.href
                const class1 = active ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                const class2 = active ? `text-sky-400` : ``
                return (
                    <a
                        href={link.href}
                        className={
                            `flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 group ${class1}`}
                    >
                        <Icon src={link.icon} class={`size-4 transition-transform group-hover:scale-110 ${class2}`} />
                        <span className="text-sm font-bold tracking-tight">
                            {link.label()}
                        </span>
                    </a>
                )
            })
        }

    </nav>
}