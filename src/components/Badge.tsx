import { Tag } from "@payload-types";

export function Badge({tag}: {tag:Tag}) {
  return (<div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-tight shadow-sm hover:border-sky-200 hover:bg-sky-50 transition-colors">
    {/* <Icon src={mapping[icon] ? mapping[icon] : BadgeInfo} className="size-3 text-slate-400"></Icon> */}
    <span className="truncate max-w-30">{tag.name}</span>
  </div>
  )
}