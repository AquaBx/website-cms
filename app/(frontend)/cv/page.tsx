import { getPayload } from 'payload'
import config from '@payload-config'
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";
import { BlogCard } from "@/components/Cards";
import Typst from '@/components/Typst/Typst';
import { Media, Project, Timeline } from '@payload-types';
import { headers } from 'next/headers';
import { projectBlock, timelineBlock, toTypstObject } from '@/components/Typst/cv';

export const dynamic = 'force-dynamic'
export default async function () {
  const payload = await getPayload({ config })

  const commonOptions = {
    locale: getLocale(),
    pagination: false as const,
    overrideAccess: true,
  }

  const [globals, projects, work, education, volunteering, competition] = await Promise.all([
    payload.findGlobal({ slug: 'global-settings', ...commonOptions }),
    payload.find({ collection: 'projects', ...commonOptions }),
    payload.find({ collection: 'timeline', ...commonOptions, where: { type: { equals: "work" } } }),
    payload.find({ collection: 'timeline', ...commonOptions, where: { type: { equals: "education" } } }),
    payload.find({ collection: 'timeline', ...commonOptions, where: { type: { equals: "volunteering" } } }),
    payload.find({ collection: 'timeline', ...commonOptions, where: { type: { equals: "competition" } } }),
  ])


  const photoUrl = (globals.photo as Media)?.url;

  if (!photoUrl) {
    throw new Error("L'URL de la photo est introuvable");
  }

  const headersList = await headers();

  const response = await fetch(headersList.get('host') + photoUrl);

  if (!response.ok) {
    throw new Error(`Échec du chargement de l'image : ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const avatar = new Uint8Array(arrayBuffer);


const mailObj = {"icon":"envelope", name:globals.mail, link:`mailto:${globals.mail}`}
const phoneObj = {"icon":"phone", name:globals.phone, link:`tel:${globals.phone}`}
const addessObj = {"icon":"house", name:globals.address, link:`https://maps.apple.com/?q=:${globals.address}`}

  const main = `
#import "template.typ": entry_item,header,section_title
#set page(
  height: ${100}cm,
    width: 21.0cm,
  margin: (x: 0cm, top: 0cm, bottom: 0cm),
  fill: white,
)

#header((url:"/avatar.png",dx:0%,dy:0%,scale:1.1),"${globals.name}","${globals.name}", ${toTypstObject([mailObj,phoneObj,addessObj,...globals.socials])})

#block(
width: 100%,
inset: (x: 1.5cm, top: 0.5cm),
[
${timelineBlock(m.work(), work.docs)}
${projectBlock(m.projects(), projects.docs)}
${timelineBlock(m.studies(), education.docs)}
${timelineBlock(m.contests(), competition.docs)}
${timelineBlock(m.volunteering(), volunteering.docs)}
]
)
`


  return (
    <main className="min-h-dvh w-dvw flex items-center flex-col text-slate-900 px-4 py-12">
      <div className="flex flex-col items-center gap-2 text-center pt-8 pb-16 print:hidden">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {m.cv()}
        </h1>
        <div className="h-1 w-12 bg-slate-900 rounded-full mt-2"></div>
      </div>
      <div className="mx-auto grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] max-w-4xl w-full gap-4">
        <Typst main={main} avatar={avatar}></Typst>
      </div>
    </main>
  );
}