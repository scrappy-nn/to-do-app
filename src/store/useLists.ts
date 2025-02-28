'use client';

import { useEffect, useState } from 'react';
import { db, List } from './db';

export function useLists() {
    const [lists, setLists] = useState<List[]>([]);

    useEffect(() => {
        async function fetchLists() {
            const allLists = await db.lists.toArray();
            setLists(allLists);
        }
        fetchLists();
    }, []);

    async function addList(title: string) {
        await db.lists.add({ title });
        setLists(await db.lists.toArray());
    }

    async function deleteList(id: number) {
        await db.lists.delete(id);
        await db.tasks.where({ listId: id }).delete();
        setLists(await db.lists.toArray());
    }

    async function renameList(id: number, newTitle: string) {
        await db.lists.update(id, { title: newTitle });
        setLists(await db.lists.toArray());
    }

    return {
        lists,
        addList,
        deleteList,
        renameList
    };
}
