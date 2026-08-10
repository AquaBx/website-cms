import { Project, Timeline } from "@payload-types"


export function timelineBlock(title: string, items: Timeline[]) {
  if (items.length === 0) return ""

  const pipe = (el: Timeline) => {
    return `#entry_item("${el.title}","${el.company}","${el.location}","${el.startDate} - ${el.endDate}","${el.description}","")`
  }

  return `
  #section_title("${title}")
  ${items.map(pipe).join("\n")}
  `
}


export function projectBlock(title: string, items: Project[]) {
  if (items.length === 0) return ""

  const pipe = (el: Project) => {
    console.log(toTypstObject(el.tags))
    return `#entry_item("${el.title}","","","","${el.content}",${toTypstObject(el.tags)})`
  }

  return `
  #section_title("${title}")
  ${items.map(pipe).join("\n")}
  `
}

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
    console.log(object)
    const obj: string = Object.entries(object).map(
      ([k, v]: [string, any]) => { return `${k} : ${toTypstObject(v)}` }
    ).join(",")
    return `( ${obj}, )`
  }
}