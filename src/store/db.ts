'use client';

import Dexie, { Table } from 'dexie';

export interface List {
    id?: number;
    title: string;
}

export interface Task {
    id?: number;
    listId: number;
    text: string;
    isDone: boolean;
}

class MyDB extends Dexie {
    lists!: Table<List, number>;
    tasks!: Table<Task, number>;

    constructor() {
        super('my-todo-db');
        this.version(1).stores({
            lists: '++id, title',
            tasks: '++id, listId, text, isDone'
        });
    }
}

export const db = new MyDB();
