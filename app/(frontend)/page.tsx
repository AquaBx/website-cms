import Image from "next/image";
import { getPayload } from 'payload'
import config from '@payload-config'
import { m } from "@/paraglide/messages";

import Icon from "@/components/Icon";
import { iconMap } from "@/icons";
import { CircleAlert } from "@steeze-ui/lucide-icons";
import { Media } from "@payload-types";


export const dynamic = 'force-dynamic'
export default async function Home() {
  const age = Math.floor(
    (Date.now() - new Date(2003, 5, 19).getTime()) / 31556952000,
  );

  const payload = await getPayload({ config })
  const globals = await payload.findGlobal({
    slug: 'global-settings',
    overrideAccess: false,
  })

  return (
    <main className="min-h-[80dvh] w-dvw flex items-center flex-col justify-center text-slate-900 px-4 py-12">

      <div
        className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-12 md:gap-16"
      >
        <div className="relative group">
          <div
            className="absolute -inset-4 bg-sky-100 rounded-2xl scale-95 group-hover:scale-100 transition-transform duration-500 opacity-50"
          ></div>
          <Image
            src={(globals.photo as Media).url || ""}
            alt={(globals.photo as Media).alt || ""}
            width={(globals.photo as Media).width || 0}
            height={(globals.photo as Media).height || 0}
            className="w-64 md:w-80 aspect-3/4 rounded-xl shadow-2xl object-cover relative z-10 transition-all duration-500 group-hover:-translate-y-2"
          />
        </div>

        <div className="flex flex-col gap-6 flex-1 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h1
              className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900"
            >
              {globals.name}<span className="text-sky-500">.</span>
            </h1>
          </div>

          <p className="text-lg leading-relaxed text-slate-600 max-w-2xl">
            {m.description({ age })}
          </p>

          <div
            className="flex gap-6 justify-center md:justify-start items-center mt-4"
          >
            {globals.socials.map(({ name, icon, link, id }, i) => {
              return <a
                target="_blank"
                key={i.toString()}
                className="size-6 transition-all duration-300 text-slate-400 {color} hover:scale-110"
                href={link}
              >
                <Icon src={iconMap.get(icon) || CircleAlert}></Icon>
              </a>
            })}

          </div>
        </div>
      </div>
    </main>
  );
}
