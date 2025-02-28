'use client';

import { useEffect, useState } from 'react';
import { db, Task } from './db';

export function useTasks(listId?: number) {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (listId === undefined) return;
        async function fetchTasks() {
            const tasksForList = await db.tasks.where({ listId }).toArray();
            setTasks(tasksForList);
        }
        fetchTasks();
    }, [listId]);

    async function addTask(text: string) {
        if (listId === undefined) return;
        await db.tasks.add({
            listId,
            text,
            isDone: false,
        });
        setTasks(await db.tasks.where({ listId }).toArray());
    }

    async function updateTask(id: number, newText: string) {
        await db.tasks.update(id, { text: newText });
        setTasks(await db.tasks.where({ listId }).toArray());
    }

    async function toggleTaskDone(id: number, isDone: boolean) {
        await db.tasks.update(id, { isDone });
        setTasks(await db.tasks.where({ listId }).toArray());
    }

    async function deleteTask(id: number) {
        await db.tasks.delete(id);
        setTasks(await db.tasks.where({ listId }).toArray());
    }

    return {
        tasks,
        addTask,
        updateTask,
        toggleTaskDone,
        deleteTask
    };
}
