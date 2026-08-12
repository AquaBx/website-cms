import { Project, Tag, Timeline } from "@payload-types"
import { $typst, createTypstCompiler, createTypstRenderer, loadFonts } from '@myriaddreamin/typst.ts';
import { TypstSnippet } from "@myriaddreamin/typst.ts/dist/esm/contrib/snippet.mjs";
// import { createGlobalRenderer } from "@myriaddreamin/typst.ts/contrib/global-renderer";
// import { createGlobalCompiler } from "@myriaddreamin/typst.ts/contrib/global-compiler";

const compilerWasmUrl = new URL(
  '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm',
  import.meta.url
).href;
const rendererWasmUrl = new URL(
  '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm',
  import.meta.url
).href;
const awesome1 = new URL(
  './fonts/Font Awesome 7 Brands-Regular-400.otf',
  import.meta.url
).href;
const awesome2 = new URL(
  './fonts/Font Awesome 7 Free-Regular-400.otf',
  import.meta.url
).href;
const awesome3 = new URL(
  './fonts/Font Awesome 7 Free-Solid-900.otf',
  import.meta.url
).href;
const aptosUrl = new URL(
  './fonts/Aptos.ttf',
  import.meta.url
).href;
const aptosBlackUrl = new URL(
  './fonts/Aptos-Black.ttf',
  import.meta.url
).href;
const aptosBoldUrl = new URL(
  './fonts/Aptos-Bold.ttf',
  import.meta.url
).href;
const aptosExtraBoldUrl = new URL(
  './fonts/Aptos-ExtraBold.ttf',
  import.meta.url
).href;
const aptosLightUrl = new URL(
  './fonts/Aptos-Light.ttf',
  import.meta.url
).href;
export function toTypstObject(object: any): string {

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
    const obj: string = Object.entries(object).map(
      ([k, v]: [string, any]) => { return `${k} : ${toTypstObject(v)}` }
    ).join(",")
    return `( ${obj}, )`
  }
}

export class CV {

  contents: string[]
  tags: string[]
  header: string
  certifications: string
  description: string
  languages: string
  constructor() {
    this.contents = []
    this.tags = []
    this.header = ""
    this.certifications = ""
    this.languages = ""
    this.description = ""
  }
  content(lang: string) {
    return `
#import "template.typ": entry_item,header,section_title,tag
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

[  #section_title("Languages")
  #stack(
    dir: ttb,
    spacing: 5pt,
    ${this.languages}
  )
],
[  #section_title("Certifications")
  #stack(
    dir: ttb,
    spacing: 5pt,
    ${this.certifications}
  )]
)

  #v(6pt)
  #section_title("Skills")
  #stack(
    dir: ttb,
    spacing: 5pt,
    ${this.tags.join(",")}
  )
    
  ]
  

)
`
  }

  addTag(tag: Tag) {
    this.tags.push(`tag(${toTypstObject(tag)})`)
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
      return `#entry_item("${el.title}","${el.company}","${el.location}","${el.date}","${el.description}",${el.tags})`
    })

    this.contents.push(`\n#section_title("${title}")\n${(piped).join("\n")}`)
  }

  addTimelineBlock(title: string, items: Timeline[]) {
    const pipe = (el: Timeline) => {
      return {
        title: el.title || "",
        company: el.company || "",
        location: el.location || "",
        date: el.startDate + "-" + el.endDate || "",
        description: el.description as any as string || "",
        tags: "",
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
        description: el.content || "",
        tags: toTypstObject(el.tags || []),
      }
    }
    this.addBlock(title, items.map(pipe))
  }
  setHeader(name: string, socials: { icon: string; name: string; link: string; }[]) {
    this.header = `#header((url:"/avatar.png",dx:0%,dy:0%,scale:1.1),"${name}","${name}", ${toTypstObject(socials)})`
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

  addBinarySource(path: string, content: Uint8Array<ArrayBuffer>) {
    if (!TypstManager.typst) return

    TypstManager.typst.mapShadow(path, content);
  }

  async pdf(): Promise<Uint8Array<ArrayBufferLike> | undefined> {
    if (!TypstManager.typst) return

    return TypstManager.typst.pdf({ inputs: this.inputs, mainFilePath: '/main.typ' })
  }
}