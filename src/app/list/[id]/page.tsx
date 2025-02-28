'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useLists } from '@/store/useLists';
import { useTasks } from '@/store/useTasks';
import { Pencil, SquarePlus, Trash2, CircleArrowLeft } from 'lucide-react';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';
import {useState} from "react";

export default function ListPage() {
    const router = useRouter();
    const params = useParams();
    const listId = Number(params.id);

    const { lists, deleteList, renameList } = useLists();
    const { tasks, addTask, updateTask, toggleTaskDone, deleteTask } = useTasks(listId);

    const currentList = lists.find((l) => l.id === listId);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalDefault, setModalDefault] = useState('');
    const [modalAction, setModalAction] = useState<(value: string) => void>(() => {});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingTaskText, setEditingTaskText] = useState('');

    const openRenameModal = () => {
        setModalTitle('Enter new list name');
        setModalDefault(currentList ? currentList.title : '');
        setModalAction(() => (value: string) => {
            if (value.trim() !== '' && currentList) {
                renameList(currentList.id!, value);
            }
            setIsModalOpen(false);
        });
        setIsModalOpen(true);
    };

    if (!currentList) {
        return (
            <div className="min-h-screen px-[113px] pt-[75px] flex flex-col bg-[#2C2F33]">
                <header className="flex items-center gap-4 px-8 py-[22px] border-b-2 border-[#7289DA] bg-[#23272A]">
                    <Link href="/" className="text-white hover:text-slate-300">
                        <CircleArrowLeft className="" />
                    </Link>
                    <h1 className="text-xl font-bold text-white text-[24px]">List not found</h1>
                </header>
                <main className="flex-grow p-8 text-white">
                    <p>No such list. Please go back.</p>
                </main>
            </div>
        );
    }

    const handleDeleteList = async () => {
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (currentList) {
            await deleteList(currentList.id!);
            router.push('/');
        }
        setIsDeleteModalOpen(false);
    };

    const handleAddTaskClick = () => {
        setIsAddingTask(true);
        setNewTaskText('');
    };

    return (
        <div className="min-h-screen px-[113px] pt-[75px] flex flex-col bg-[#2C2F33]">
            <header className="flex items-center justify-between px-8 py-[22px] border-b-2 border-[#7289DA] bg-[#23272A]">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-white hover:text-slate-300">
                        <CircleArrowLeft className="" />
                    </Link>
                    <h1 className="text-xl font-semibold text-white text-[24px]">
                        {currentList.title || 'New List'}
                    </h1>
                </div>
                <div className="flex gap-16">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openRenameModal();
                        }}
                        className="text-white font-normal text-[18px] flex gap-4 cursor-pointer hover:text-slate-300"
                    >
                        <Pencil />
                        Change name
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteList();
                        }}
                        className="text-white font-normal text-[18px] flex gap-4 cursor-pointer hover:text-slate-300"
                    >
                        <Trash2 className="w-4" />
                        Delete List
                    </button>
                    <button
                        onClick={handleAddTaskClick}
                        className="text-white font-normal text-[18px] flex gap-4 cursor-pointer hover:text-slate-300"
                    >
                        <SquarePlus />
                        Add to-do
                    </button>
                </div>
            </header>

            <main className="flex-grow py-8 relative">
                {(tasks.length === 0 && !isAddingTask) ? (
                    <div className="flex flex-col items-center justify-center mt-16">
                        <img src="/zombieing.svg" alt="" className="z-20 w-[400px] absolute top-40" />
                        <div className="border-4 gradient_border px-[269] py-[178] absolute opacity-20 z-10 top-[50%] left-[50%] -translate-1/2"></div>
                        <p className="text-white font-light text-2xl absolute top-150">
                            Write some task or note ;)
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {isAddingTask && (
                            <li className="flex items-center gap-4 bg-[#23272A] px-8 py-[18px] text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                                <input
                                    type="checkbox"
                                    disabled
                                    className="appearance-none relative h-6 w-6 border-2 border-white rounded-sm"
                                />
                                <input
                                    type="text"
                                    value={newTaskText}
                                    onChange={(e) => setNewTaskText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addTask(newTaskText);
                                            setNewTaskText('');
                                            setIsAddingTask(false);
                                        }
                                    }}
                                    autoFocus
                                    className="flex-1 bg-transparent text-white outline-none"
                                    placeholder="Enter task..."
                                />
                                <button
                                    onClick={() => setIsAddingTask(false)}
                                    className="text-white hover:text-slate-300 cursor-pointer"
                                >
                                    Cancel
                                </button>
                            </li>
                        )}
                        {[...tasks].sort((a, b) => {
                            if (a.isDone === b.isDone) {
                                return (b.id || 0) - (a.id || 0);
                            }
                            return a.isDone ? 1 : -1;
                        })
                            .map((task) => (
                                <li
                                    key={task.id}
                                    className="flex items-center gap-4 bg-[#23272A] px-8 py-[18px] text-white shadow-[0_4px_4px_rgba(0,0,0,0.25)]"
                                >
                                    <input
                                        type="checkbox"
                                        checked={task.isDone}
                                        onChange={(e) => toggleTaskDone(task.id!, e.target.checked)}
                                        className="appearance-none relative h-6 w-6 cursor-pointer border-2 border-white rounded-sm checked:border-gray-400 checked:before:absolute checked:before:content-[''] checked:before:bg-gray-400 checked:before:w-4 checked:before:h-4 checked:before:top-[2px] checked:before:left-[2px]"
                                    />
                                    {editingTaskId === task.id ? (
                                        <input
                                            type="text"
                                            value={editingTaskText}
                                            onChange={(e) => setEditingTaskText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    updateTask(task.id!, editingTaskText);
                                                    setEditingTaskId(null);
                                                    setEditingTaskText('');
                                                }
                                            }}
                                            autoFocus
                                            className="flex-1 bg-transparent text-white outline-none"
                                        />
                                    ) : (
                                        <span
                                            className={`flex-1 ${
                                                task.isDone ? 'line-through text-gray-400' : ''
                                            }`}
                                            onDoubleClick={() => {
                                                setEditingTaskId(task.id!);
                                                setEditingTaskText(task.text);
                                            }}
                                        >
                {task.text}
              </span>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (editingTaskId === task.id) {
                                                setEditingTaskId(null);
                                                setEditingTaskText('');
                                            } else {
                                                setEditingTaskId(task.id!);
                                                setEditingTaskText(task.text);
                                            }
                                        }}
                                        className="text-white hover:text-slate-300 cursor-pointer"
                                    >
                                        <Pencil className="w-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task.id!)}
                                        className="text-white hover:text-slate-300 cursor-pointer"
                                    >
                                        <Trash2 className="w-4" />
                                    </button>
                                </li>
                            ))}
                    </ul>
                )}
            </main>
            {isModalOpen && (
                <Modal
                    title={modalTitle}
                    defaultValue={modalDefault}
                    onSubmit={(value) => modalAction(value)}
                    onCancel={() => setIsModalOpen(false)}
                />
            )}
            {isDeleteModalOpen && (
                <ConfirmModal
                    message={`Are you sure you want to delete "${currentList.title}"?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                />
            )}
        </div>
    );
}
