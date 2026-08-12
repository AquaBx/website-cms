import { getPayload } from 'payload'
import config from '@payload-config'
import { m } from "@/paraglide/messages"
import { getLocale } from "@/paraglide/runtime"
import { Media } from '@payload-types'
import path from 'path'
import CVBuilder from '@/components/Typst/CVBuilder'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const payload = await getPayload({ config })
  const locale = getLocale()

  const commonOptions = {
    locale,
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

  const photo = globals.photo as Media
  if (!photo || !photo.filename) {
    throw new Error("La photo ou son nom de fichier est introuvable")
  }

  const filePath = path.join(process.cwd(), 'media', photo.filename)
  const file = Bun.file(filePath)
  const avatar = await file.bytes()

  return (
    <main className="min-h-dvh w-dvw flex items-center flex-col text-slate-900 px-4 py-12">
      <div className="flex flex-col items-center gap-2 text-center pt-8 pb-8 print:hidden">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {m.cv()}
        </h1>
        <div className="h-1 w-12 bg-slate-900 rounded-full mt-2"></div>
      </div>

      <CVBuilder
        locale={locale}
        messages={{
          work: m.work(),
          projects: m.projects(),
          studies: m.studies(),
          contests: m.contests(),
          volunteering: m.volunteering(),
        }}
        globals={globals}
        data={{
          projects: projects.docs,
          work: work.docs,
          education: education.docs,
          volunteering: volunteering.docs,
          competition: competition.docs,
        }}
        avatar={avatar}
      />
    </main>
  )
}