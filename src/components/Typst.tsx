"use client"

import { $typst, loadFonts } from '@myriaddreamin/typst.ts';

const compilerWasmUrl = new URL(
    '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm',
    import.meta.url
).href;
const rendererWasmUrl = new URL(
    '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm',
    import.meta.url
).href;
const notoSansUrl = new URL(
    './NotoSans-VariableFont_wdth,wght.ttf',
    import.meta.url
).href;

import { useEffect, useState } from 'react';
let inited = false;

function setTypst() {
    if (!inited) {
        $typst.setCompilerInitOptions({
            beforeBuild: [
                loadFonts([notoSansUrl])
            ],
            getModule: () =>
                compilerWasmUrl,
        });

        $typst.setRendererInitOptions({
            beforeBuild: [
                loadFonts([notoSansUrl])
            ],
            getModule: () => rendererWasmUrl,
        });

        inited = true;
    }
    return $typst;
};


type typstFiles = {
    [key: string]: string
}

export default function ({
    inputs = { '/main.typ': 'mainContent' },
    binaryInputs = {} as { [key: string]: Uint8Array }
}: {
    inputs: typstFiles,
    binaryInputs?: { [key: string]: Uint8Array }
}) {
    const typst = setTypst();


    for (const [path, content] of Object.entries(inputs)) {
        typst.addSource(path, content);
    }

    for (const [path, content] of Object.entries(binaryInputs)) {
        typst.mapShadow(path, content);
    }

    let [compiling, setCompiling] = useState(true);
    let [compiledUrl, setCompileUrl] = useState<string | null>(null);

    useEffect(() => {
        setCompiling(true)
        typst.pdf({ inputs: inputs, mainFilePath: '/main.typ' }).then((compiled: any) => {
            if (compiled) {
                const blob = new Blob([compiled.buffer as ArrayBuffer], { type: 'application/pdf' });
                if (compiledUrl){
                    URL.revokeObjectURL(compiledUrl)
                }
                setCompileUrl(URL.createObjectURL(blob))
            }
            setCompiling(false)
        })
    }, [inputs, binaryInputs])

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