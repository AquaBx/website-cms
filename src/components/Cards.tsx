import Image from "next/image";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Media, Post, Project, Tag, Timeline } from "@payload-types"
import Icon from "./Icon";
import { Calendar, MapPin } from "@steeze-ui/lucide-icons";
import { m } from "@/paraglide/messages";
import { Badge } from "./Badge";

function FormattedDate(date: string) {
    let date2 = new Date(date)
    return (
        <time dateTime={date2.toISOString()}>
            {date2.toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit" })}
        </time>
    )
}

export function TimelineCard({ element }: { element: Timeline }) {
    return <div className="flex-1 p-6 md:p-8 flex flex-col gap-4 group relative bg-white border border-slate-200 rounded-2xl overflow-hidden ">
        <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
                <h3
                    className="text-2xl font-bold tracking-tight text-slate-900 transition-colors"
                >
                    {element.title}

                </h3>

                <div
                    className="flex gap-1.5 items-center text-sm text-slate-400 font-medium"
                >
                    <Icon src={MapPin} className="size-3.5" />
                    <span>{element.company} - {element.location}</span>
                </div>
            </div>

            <div className="hidden sm:flex flex-col items-end gap-1">
                <div
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md"
                >
                    <Icon src={Calendar} className="size-3" />
                    {FormattedDate(element.startDate)} — {element.endDate ? FormattedDate(element.endDate) : m.today()}
                </div>
            </div>
        </div>

        <div
            className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base"
        >
            <RichText data={element.description as any}></RichText>
        </div>
    </div>
}

export function ProjectCard({ content, title, createdAt, id, url, tags, ...el }: Project) {
    return (
        <a href={url || ""} className="flex flex-col p-4 border border-slate-200 shadow-md bg-white rounded-2xl overflow-hidden">

            <h2 className="font-black text-2xl leading-tight">
                {title}
            </h2>

            <div className="mb-2">
                <p className="text-slate-600 line-clamp-3">
                    <RichText data={content as any}></RichText>
                </p>
            </div>

            {(tags || []).map((tag) => { return <Badge tag={tag as Tag}></Badge> })}
        </a>
    )
}

const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
};



export function BlogCard({ content, tags, title, createdAt, summary, id, ...el }: Post) {
    return (
        <a href={"/blog/" + id} className="flex flex-col p-4 border border-slate-200 shadow-md bg-white rounded-2xl overflow-hidden">

            <h2 className="font-black text-2xl leading-tight">
                {title}
            </h2>

            <span className="text-sm text-slate-500 mb-2">
                {new Date(createdAt).toLocaleDateString("fr", options)}
            </span>
            {el.coverImage ? <Image alt={(el.coverImage as Media).alt} width={(el.coverImage as Media).width || 0} height={(el.coverImage as Media).height || 0} className="mb-2 object-cover w-full aspect-video" src={(el.coverImage as Media).url || ""} /> : ""}

            <div className="mb-2">
                <p className="text-slate-600 line-clamp-3">
                    {summary}
                </p>
            </div>

            <div className="flex gap-4 ">
                {tags.map((tag) => { return <Badge tag={tag as Tag}></Badge> })}
            </div>
        </a>
    )
}