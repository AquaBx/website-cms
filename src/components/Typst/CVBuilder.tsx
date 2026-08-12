'use client'

import { useState } from 'react'
import Typst from '@/components/Typst/Typst'
import { CV } from '@/components/Typst/cv'
import { Tag } from '@payload-types'

interface CVBuilderProps {
    locale: string
    messages: {
        work: string
        projects: string
        studies: string
        contests: string
        volunteering: string
    }
    globals: any
    data: {
        projects: any[]
        work: any[]
        education: any[]
        volunteering: any[]
        competition: any[]
    }
    avatar: Uint8Array<ArrayBuffer>
}

export default function CVBuilder({ locale, messages, globals, data, avatar }: CVBuilderProps) {
    // Sélection des éléments par ID (vide par défaut)
    const [selectedProjects, setSelectedProjects] = useState<string[]>([])
    const [selectedWork, setSelectedWork] = useState<string[]>([])
    const [selectedEducation, setSelectedEducation] = useState<string[]>([])
    const [selectedVolunteering, setSelectedVolunteering] = useState<string[]>([])
    const [selectedCompetition, setSelectedCompetition] = useState<string[]>([])

    const toggleItem = (id: string, list: string[], setList: (val: string[]) => void) => {
        setList(list.includes(id) ? list.filter((i) => i !== id) : [...list, id])
    }

    // Construction dynamique du CV selon la sélection
    const mailObj = { icon: 'envelope', name: globals.mail, link: `mailto:${globals.mail}` }
    const phoneObj = { icon: 'phone', name: globals.phone, link: `tel:${globals.phone}` }
    const addessObj = { icon: 'house', name: globals.address, link: `https://maps.apple.com/?q=:${globals.address}` }

    const main = new CV()
    main.setHeader(globals.name, [mailObj, phoneObj, addessObj, ...globals.socials])
    main.setDescription('Résumé', 'Coucou')

    const filteredWork = data.work.filter((item) => selectedWork.includes(item.id))
    const filteredProjects = data.projects.filter((item) => selectedProjects.includes(item.id))
    const filteredEducation = data.education.filter((item) => selectedEducation.includes(item.id))
    const filteredCompetition = data.competition.filter((item) => selectedCompetition.includes(item.id))
    const filteredVolunteering = data.volunteering.filter((item) => selectedVolunteering.includes(item.id))

    if (filteredWork.length > 0) main.addTimelineBlock(messages.work, filteredWork)
    if (filteredProjects.length > 0) main.addProject(messages.projects, filteredProjects)
    if (filteredEducation.length > 0) main.addTimelineBlock(messages.studies, filteredEducation)
    if (filteredCompetition.length > 0) main.addTimelineBlock(messages.contests, filteredCompetition)
    if (filteredVolunteering.length > 0) main.addTimelineBlock(messages.volunteering, filteredVolunteering)

    main.addLanguage('Français', 'Native')
    main.addLanguage('Anglais', 'C1')
    main.addLanguage('Espagnol', 'B1')
    main.addLanguage('Polonais', 'Basics')

    main.addCertification('Toeic', '965/990', 2024)
    main.addCertification('Sensibilisation aux ODD', '', 2023)
    main.addCertification('Baccalauréat', 'Highest Honors', 2021)
    main.addCertification('Permis B', '', 2021)
    main.addCertification('PSC1', '', 2018)

    for (const { tags } of filteredProjects) {
        ((tags as Tag[]) || []).forEach((tag: Tag) => {
            main.addTag(tag)
        })
    }

    const renderSectionControls = (
        title: string,
        items: any[],
        selectedList: string[],
        setSelectedList: (val: string[]) => void,
        getLabel: (item: any) => string
    ) => {
        if (items.length === 0) return null
        return (
            <div className="flex flex-col gap-2" >
                <h3 className="font-bold text-slate-800" > {title} </h3>
                < div className="flex flex-wrap gap-2" >
                    {
                        items.map((item) => {
                            const isChecked = selectedList.includes(item.id)
                            return (
                                <label
                                    key={item.id}
                                    className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border cursor-pointer transition ${isChecked
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                                        }`
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isChecked}
                                        onChange={() => toggleItem(item.id, selectedList, setSelectedList)
                                        }
                                    />
                                    {getLabel(item)}
                                </label>
                            )
                        })}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl flex flex-col gap-8" >
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-6 print:hidden" >
                <h2 className="text-xl font-bold" > Sélectionner les éléments à inclure </h2>

                {renderSectionControls(messages.work, data.work, selectedWork, setSelectedWork, (i) => i.title || i.company)}
                {renderSectionControls(messages.projects, data.projects, selectedProjects, setSelectedProjects, (i) => i.title)}
                {renderSectionControls(messages.studies, data.education, selectedEducation, setSelectedEducation, (i) => i.title || i.school)}
                {renderSectionControls(messages.contests, data.competition, selectedCompetition, setSelectedCompetition, (i) => i.title)}
                {renderSectionControls(messages.volunteering, data.volunteering, selectedVolunteering, setSelectedVolunteering, (i) => i.title)}
            </div>

            < div className="mx-auto grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] w-full gap-4" >
                <Typst main={main.content(locale)} avatar={avatar} />
            </div>
        </div>
    )
}