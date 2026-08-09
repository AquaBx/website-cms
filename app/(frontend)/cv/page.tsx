import { getPayload } from 'payload'
import config from '@payload-config'
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";
import { BlogCard } from "@/components/Cards";
import Typst from '@/components/Typst';
import { Project, Timeline } from '@payload-types';
// import templateContent from "./template.typ?raw";

const template = `
#let title_color = rgb("#1e1b4b")   // Indigo très sombre pour une structure élégante
#let accent_color = rgb("#2563eb")  // Bleu royal dynamique pour les dates & éléments clés
#let text_color = rgb("#334155")    // Ardoise sombre pour un confort de lecture optimal
#let text_light = rgb("#f8fafc")    // Blanc cassé / Gris très clair pour le header

#let header(name, header_text, socials) = {
  set text(font: "Noto Sans")
  block(
    width: 100%,
    inset: (x: 1cm, y: 1cm),
    fill: title_color,
    radius: (bottom : 32pt, top : 0pt),
    [
      #set text(fill: text_light)
      #grid(
        columns: (auto, 1fr),
        gutter: 20pt,
        align: (center + horizon, left + horizon),
        
        // Avatar / Initiale
        block(
          width: 100pt,
          height: 100pt,
          radius: 50%,
          stroke: 1.5pt + text_light,
          fill: title_color.lighten(15%),
          [
            #place(center + horizon, text(weight: "bold", size: 14pt, fill: text_light)[
              #upper(name.clusters().first())
            ])
          ]
        ),
        
        // Informations principales
        [
          #text(size: 18pt, weight: "bold", tracking: 1pt, fill: white)[
            #upper(name)
          ]
          #v(-12pt)
          #text(size: 10pt, weight: "medium", fill: rgb("#94a3b8"), tracking: 1.5pt)[
            #upper(header_text)
          ]
          
          #v(4pt)
          
          // Grille de contacts
          #set text(size: 8pt, fill: text_light)
          #grid(
            columns: (1fr, 1fr),
            row-gutter: 4pt,
            column-gutter: 10pt,
            ..socials.map(social => [
              #if social.at("link", default: none) != none [
                #link(social.link)[#text(fill: text_light)[#social.name]]
              ] else [
                #social.name
              ]
            ])
          )
        ]
      )
    ]
  )
}

#let section_title(title) = {
  set text(font: "Noto Sans")
  v(12pt)
  text(size: 12pt, weight: "bold", fill: title_color, tracking: 0.5pt)[
    #upper(title)
  ]
  v(-4pt)
  line(length: 100%, stroke: 1.5pt + accent_color)
  v(4pt)
}

#let entry_item(title, company, address, dates, description, tags) = {
  set text(font: "Noto Sans")
  block(
    width: 100%,
    inset: (y: 2pt),
    [
      // En-tête de l'expérience (Titre & Dates)
      #grid(
        columns: (1fr, auto),
        align: (left, right),
        text(weight: "bold", size: 10.5pt, fill: title_color, title),
        text(size: 9pt, weight: "medium", fill: accent_color, dates)
      )
      
      #v(-3pt)
      
      // Entreprise & Localisation
      #grid(
        columns: (1fr, auto),
        align: (left, right),
        text(size: 9.5pt, weight: "semibold", fill: text_color, company),
        text(size: 8.5pt, style: "italic", fill: rgb("#64748b"), address)
      )
      
      #v(2pt)
      
      // Description
      #if description != "" and description != none [
        #text(size: 9pt, fill: text_color)[#description]
      ]
    ]
  )
}`

function timelineBlock(title: string, items: Timeline[]) {
  if (items.length === 0) return ""

  const pipe = (el: Timeline) => {
    return `#entry_item("${el.title}","${el.company}","${el.location}","${el.startDate} - ${el.endDate}","${el.description}","")`
  }

  return `
  #section_title("${title}")
  ${items.map(pipe).join("\n")}
  `
}


function projectBlock(title: string, items: Project[]) {
  if (items.length === 0) return ""

  const pipe = (el: Project) => {
    return `#entry_item("${el.title}","","","","${el.content}","")`
  }

  return `
  #section_title("${title}")
  ${items.map(pipe).join("\n")}
  `
}

function toTypstObject(object: any): string {

  if (typeof object === "string") {
    return `"${object}"`
  }
  else if (typeof object === "number") {
    return `${object}`
  }
  else if (Array.isArray(object)) {
    return `( ${(object as Array<any>).map(toTypstObject).join(",")}, )`
  }
  else {
    console.log(object)
    const obj: string = Object.entries(object).map(
      ([k, v]: [string, any]) => { return `${k} : ${toTypstObject(v)}` }
    ).join(",")
    return `( ${obj}, )`
  }
}

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

  const main = `
#import "template.typ": entry_item,header,section_title
#set page(
  height: ${100}cm,
    width: 21.0cm,
  margin: (x: 0cm, top: 0cm, bottom: 0cm),
  fill: white,
)

#header("${globals.name}","${globals.name}", ${toTypstObject(globals.socials)})

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
  console.log(main)
  const inputs = {
    "/template.typ": template,
    "/main.typ": main
  }

  const binaryInputs = {
    // "/template.typ": templateContent,
    // "/main.typ": mainTypContent
  }

  return (
    <main className="min-h-dvh w-dvw flex items-center flex-col text-slate-900 px-4 py-12">
      <div className="flex flex-col items-center gap-2 text-center pt-8 pb-16 print:hidden">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {m.cv()}
        </h1>
        <div className="h-1 w-12 bg-slate-900 rounded-full mt-2"></div>
      </div>
      <div className="mx-auto grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] max-w-4xl w-full gap-4">
        <Typst inputs={inputs} binaryInputs={binaryInputs}></Typst>
      </div>
    </main>
  );
}