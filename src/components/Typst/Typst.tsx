"use client"

import template from "./template.typ"
import fontAwesomeLib from "./fontawesome/lib.typ"
import fontAwesomeLibImpl from "./fontawesome/lib-impl.typ"
import fontAwesomeLibMap from "./fontawesome/lib-gen-map.typ"
import fontAwesomeLibFunc from "./fontawesome/lib-gen-func.typ"
import { useEffect, useState } from 'react';
import { TypstManager } from './cv';

export default function ({ main, avatar }: { main: string, avatar: Uint8Array<ArrayBuffer> }) {
    const inputs = {
        "@preview/fontawesome:0.6.2": fontAwesomeLib,
        "lib-impl.typ": fontAwesomeLibImpl,
        "lib-gen-map.typ": fontAwesomeLibMap,
        "lib-gen-func.typ": fontAwesomeLibFunc,
        "/template.typ": template,
        "/main.typ": main
    }

    const typst = new TypstManager();

    const binaryInputs = {
        '/avatar.png': avatar
    }

    for (const [path, content] of Object.entries(inputs)) {
        typst.addSource(path, content);
    }

    for (const [path, content] of Object.entries(binaryInputs)) {
        typst.addBinarySource(path, content);
    }

    let [compiling, setCompiling] = useState(true);
    let [compiledUrl, setCompileUrl] = useState<string | null>(null);

    useEffect(() => {
        setCompiling(true)
        typst.pdf().then((compiled) => {
            if (compiled) {
                const blob = new Blob([compiled.buffer as ArrayBuffer], { type: 'application/pdf' });
                if (compiledUrl) {
                    URL.revokeObjectURL(compiledUrl)
                }
                setCompileUrl(URL.createObjectURL(blob))
            }
            setCompiling(false)
        })
    }, [main, avatar])

    return <div className="flex-1 flex flex-col relative h-full w-full min-h-150">
        {compiling ?
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50 bg-opacity-50 z-10 rounded-xl transition-all duration-300">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    <span className="text-sm font-medium text-slate-600">Compilation Typst en cours...</span>
                </div>
            </div>
            : ""
        }
        {compiledUrl ?
            <iframe className="flex-1 w-full h-full border border-slate-200 rounded-xl shadow-lg" src={compiledUrl} title="Typst CV Preview"></iframe>
            :
            <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                Génération en cours...
            </div>
        }
    </div>
}