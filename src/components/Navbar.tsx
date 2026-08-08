import { m } from "@/paraglide/messages";
import { House, Briefcase, Image, Music, FileText, Flag, Newspaper } from "@steeze-ui/lucide-icons";
import Icon from "@/components/Icon";
import { headers } from "next/headers";

export default async function () {
    const heads = await headers()
    const pathname = heads.get('x-pathname')
    console.log(pathname)
    const links = [
        { href: "/", label: m.home, icon: House },
        { href: "/timeline", label: m.timeline, icon: Flag },
        { href: "/blog", label: m.blog, icon: Newspaper },
        { href: "/projects", label: m.projects, icon: Briefcase },
        // { href: "/gallery", label: m.gallery, icon: Image },
        // { href: "/music", label: m.music, icon: Music },
        { href: "/cv", label: m.cv, icon: FileText },
    ];
    return <nav className="rounded-full  bg-white/20 border-white/30 backdrop-blur-xl fixed bottom-6 left-1/2 -translate-x-1/2 p-2 border shadow-2xl  z-50 flex gap-1">
        {
            links.map((link,i) => {
                const active = pathname === link.href
                const class1 = active ? "rounded-full bg-sky-500/40 border-sky-500/5O text-sky-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                return (
                    <a
                        key={i}
                        href={link.href}
                        className={
                            `flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 group ${class1}`}
                    >
                        <Icon src={link.icon} className={`size-4 transition-transform group-hover:scale-110`} />
                        <span className="text-sm font-bold tracking-tight">
                            {link.label()}
                        </span>
                    </a>
                )
            })
        }
    </nav>
}
