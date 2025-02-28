'use client';

import Link from 'next/link';
import { useLists } from '@/store/useLists';
import {ArrowRight, CirclePlus} from 'lucide-react';
import './globals.css'
import Modal from '@/components/Modal';
import {useState} from "react";


export default function HomePage() {
    const { lists, addList } = useLists();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDefault, setModalDefault] = useState('');
    const [modalAction, setModalAction] = useState<(value: string) => void>(() => {});

    const openModal = (
        title: string,
        defaultValue: string,
        action: (value: string) => void
    ) => {
        setModalTitle(title);
        setModalDefault(defaultValue);
        setModalAction(() => action);
        setIsModalOpen(true);
    };

    const handleCreateList = () => {
        openModal('Enter list name', '', (value: string) => {
            if (value.trim() !== '') {
                addList(value);
            }
            setIsModalOpen(false);
        });
    };

    return (
        <div className="min-h-screen px-[113px] pt-[75px] flex flex-col bg-[#2C2F33]">
            <header className="flex items-center justify-between px-8 py-[22px] border-b-2 border-[#7289DA] bg-[#23272A]">
                <h1 className="text-white text-[24px] font-semibold">TO DO | YOUR LISTS</h1>
                <button
                    onClick={handleCreateList}
                    className="cursor-pointer text-white hover:text-slate-300 flex flex-row gap-4"
                >
                    <CirclePlus className="h-6 w-6" />
                    Add new List
                </button>
            </header>

            {lists.length === 0 ? (
                <main className="flex-grow flex items-center justify-center relative">
                    <div className="border-4 gradient_border px-[235] py-[156] absolute opacity-20"></div>
                    <h2 className="text-9xl font-bold text-white absolute">TO-DO LIST</h2>
                </main>
            ) : (
                <main className="flex-grow py-12">
                    <ul className="space-y-4">
                        {lists.map((list) => (
                            <li
                                key={list.id}
                                className="group relative flex items-center justify-between rounded p-4 shadow-[0_4px_4px_rgba(17,17,28,0.6)] cursor-pointer transition-transform duration-150 active:translate-y-1
      before:content-[''] before:absolute before:top-0 before:left-0 before:w-[10px] before:h-full before:bg-[#7289DA]"
                            >
                                <Link href={`/list/${list.id}`} className="w-full flex items-center justify-between relative">
        <span className="ml-4 text-lg text-white">
          {list.title}
        </span>
                                    <div className="mr-4 transition-transform duration-150 group-hover:translate-x-2">
                                        <ArrowRight className="h-6 w-6 text-white" />
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </main>
            )}
            {isModalOpen && (
                <Modal
                    title={modalTitle}
                    defaultValue={modalDefault}
                    onSubmit={(value) => modalAction(value)}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
