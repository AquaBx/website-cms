import type { Project, Tag, Timeline } from "aquabx-config/payload-types";
import { $typst, createTypstCompiler, createTypstRenderer, loadFonts } from '@myriaddreamin/typst.ts';
import { TypstSnippet } from "@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs";
// import { createGlobalRenderer } from "@myriaddreamin/typst.ts/contrib/global-renderer";
// import { createGlobalCompiler } from "@myriaddreamin/typst.ts/contrib/global-compiler";
import { m } from "$lib/paraglide/messages";

import compilerWasmUrl from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url'

import rendererWasmUrl from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url'

import awesome1 from './fonts/Font Awesome 7 Brands-Regular-400.otf?url'

import awesome2 from './fonts/Font Awesome 7 Free-Regular-400.otf?url'

import awesome3 from './fonts/Font Awesome 7 Free-Solid-900.otf?url'

import aptosUrl from './fonts/Aptos.ttf?url'

import aptosBlackUrl from './fonts/Aptos-Black.ttf?url'

import aptosBoldUrl from './fonts/Aptos-Bold.ttf?url'

import aptosExtraBoldUrl from './fonts/Aptos-ExtraBold.ttf?url'

import aptosLightUrl from './fonts/Aptos-Light.ttf?url'

export function toTypstObject(object: any): string {

  if (typeof object === "string") {
    return `"${object}"`
  }
  else if (typeof object === "number") {
    return `${object}`
  }
  else if (Array.isArray(object)) {
    if (object.length === 0) return "()"
    return `( ${(object as Array<any>).map(toTypstObject).join(",")}, )`
  }
  else {
    const obj: string = Object.entries(object).map(
      ([k, v]: [string, any]) => { return `${k} : ${toTypstObject(v)}` }
    ).join(",")
    return `( ${obj}, )`
  }
}

import type { SerializedEditorState, SerializedLexicalNode } from "@payloadcms/richtext-lexical/lexical";

function richElToTypstObject(object: SerializedLexicalNode) {
  console.log(object)
  switch (object.type) {
    case "paragraph": return (object as any).children.map(richElToTypstObject).join("");
    case "text": return `#text("${(object as any).text}")`;
    case "list": return (object as any).children.map(richElToTypstObject).join("\n");
    case "listitem": return `- ${(object as any).children.map(richElToTypstObject).join("")}`;
    default: throw "Not Supported"
  }
}


export function richToTypst(object: SerializedEditorState | null | undefined): string {
  if (!object) return ""
  return object.root.children.map(richElToTypstObject).join("\n")
}

export class CV {

  contents: string[]
  tags: Map<string, Tag>
  header: string
  certifications: string
  description: string
  languages: string
  constructor() {
    this.contents = []
    this.tags = new Map()
    this.header = ""
    this.certifications = ""
    this.languages = ""
    this.description = ""
  }

  content(lang: string) {
    return `
#import "template.typ": entry_item,header,section_title,tag,tags_line
#set page(
  height: ${100}cm,
  width: 21.0cm,
  margin: (x: 0cm, top: 0cm, bottom: 0cm),
  fill: white,
)
#set text(
  font: "Aptos",
  lang: "${lang}",
)

${this.header}

#block(
  width: 100%,
  inset: (x: 1.5cm, top: 0.5cm),
  [
  ${this.description}

  ${this.contents.join("\n")}



#grid(
  columns: (1fr, 1fr),
  gutter: 20pt,

[  #section_title("${m.languages()}")
  #stack(
    dir: ttb,
    spacing: 5pt,
    ${this.languages}
  )
],
[  #section_title("${m.certifications()}")
  #stack(
    dir: ttb,
    spacing: 5pt,
    ${this.certifications}
  )]
)

  #v(6pt)
  #section_title("${m.skills()}")
  #tags_line(${toTypstObject(this.tags.values().toArray())})
    
  ]
  

)
`
  }

  addTag(tag: Tag) {
    this.tags.set(tag.id, tag)
  }

  addCertification(name: string, detail: string, year: number) {
    this.certifications += `
    block(width: 100%)[
      #text(weight: "bold", size: 8.8pt)[${name}] ${detail ? `#text(size: 8.8pt)[(${detail})]` : ""} — #text(style: "italic", size: 8pt)[${year}]
    ],
    `
  }

  setDescription(title: string, contenu: string) {
    this.description = `\n#section_title("${title}")\n#text("${(contenu)}")\n#v(6pt)\n`
  }

  addLanguage(name: string, level: string) {
    this.languages += `
    block(width: 100%)[
      #text(weight: "bold", size: 8.8pt)[${name}] #h(2pt) — #text(size: 8.5pt)[${level}]
    ],
    `
  }

  addBlock(title: string, items: { title: string, company: string, location: string, date: string, description: string, tags: string, }[]) {
    if (items.length === 0) return ""

    const piped = items.map((el) => {
      return `#entry_item("${el.title}","${el.company}","${el.location}","${el.date}",[${el.description}],${el.tags})`
    })

    this.contents.push(`\n#section_title("${title}")\n${(piped).join("\n")}`)
  }

  addTimelineBlock(title: string, items: Timeline[]) {
    const pipe = (el: Timeline) => {
      return {
        title: el.title || "",
        company: el.company || "",
        location: el.location || "",
        date: new Date(el.startDate).toLocaleDateString("fr") + " - " + (el.endDate ? new Date(el.endDate).toLocaleDateString("fr") : m.today()) || "",
        description: richToTypst(el.description),
        tags: "()",
      }
    }
    this.addBlock(title, items.map(pipe))
  }
  addProject(title: string, items: Project[]) {
    const pipe = (el: Project) => {
      return {
        title: el.title,
        company: "",
        location: "",
        date: "",
        description: richToTypst(el.content),
        tags: toTypstObject(el.tags || []),
      }
    }
    this.addBlock(title, items.map(pipe))
  }
  setHeader(name: string, avatar_name: string, contactInfos: { icon: string; name: string; link: string; }[], socials: { icon: string; name: string; link: string; }[]) {
    this.header = `#header((url:"/${avatar_name}",dx:0%,dy:0%,scale:1.1),"${name}","${name}",${toTypstObject(contactInfos)}, ${toTypstObject(socials)})`
  }

}

export class TypstManager {
  static typst?: TypstSnippet
  inputs: Record<string, string>
  constructor() {
    // const $typst = new TypstSnippet({
    //   // optional renderer instance
    //   renderer: (() => {
    //     return createGlobalRenderer(createTypstRenderer, {});
    //   }),
    //   compiler: (() => {
    //     return createGlobalCompiler(createTypstCompiler, {});
    //   })
    // });

    if (!TypstManager.typst) {
      $typst.setCompilerInitOptions({
        beforeBuild: [
          loadFonts([aptosUrl, aptosBlackUrl, aptosBoldUrl, aptosExtraBoldUrl, aptosLightUrl, awesome1, awesome2, awesome3])
        ],
        getModule: () => compilerWasmUrl,
      });

      $typst.setRendererInitOptions({
        beforeBuild: [
          loadFonts([aptosUrl, aptosBlackUrl, aptosBoldUrl, aptosExtraBoldUrl, aptosLightUrl, awesome1, awesome2, awesome3])
        ],
        getModule: () => rendererWasmUrl,
      });

      TypstManager.typst = $typst;
    }

    this.inputs = {}
  }

  addSource(path: string, content: string) {
    if (!TypstManager.typst) return

    TypstManager.typst.addSource(path, content);
    this.inputs[path] = content
  }

  addBinarySource(path: string, content: Uint8Array<ArrayBufferLike>) {
    if (!TypstManager.typst) return

    TypstManager.typst.mapShadow(path, content);
  }

  async pdf(): Promise<Uint8Array<ArrayBufferLike> | undefined> {
    if (!TypstManager.typst) return

    return TypstManager.typst.pdf({ inputs: this.inputs, mainFilePath: '/main.typ' })
  }
}