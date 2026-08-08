import { getPayload } from 'payload'
import config from '@payload-config'
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";
import { BlogCard } from "@/components/Cards";

export const dynamic = 'force-dynamic'
export default async function () {
  const payload = await getPayload({ config })
  const posts = await payload.find({
    collection: 'posts',
    locale: getLocale()
  })

  return (
    <main className="min-h-dvh w-dvw flex items-center flex-col text-slate-900 px-4 py-12">
      <div className="flex flex-col items-center gap-2 text-center pt-8 pb-16 print:hidden">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          {m.blog()}
        </h1>
        <div className="h-1 w-12 bg-slate-900 rounded-full mt-2"></div>
      </div>
      <div className="mx-auto grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] max-w-4xl w-full gap-4">
        {posts.docs.map(BlogCard)}
      </div>
    </main>
  );
}