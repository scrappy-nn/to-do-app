'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../app/globals.css'

interface ModalProps {
    title: string;
    defaultValue: string;
    onSubmit: (value: string) => void;
    onCancel: () => void;
}

export default function Modal({ title, defaultValue, onSubmit, onCancel }: ModalProps) {
    const [value, setValue] = useState(defaultValue);

    const [modalContainer] = useState(() => {
        const el = document.createElement('div');
        el.id = 'modal-root';
        return el;
    });

    useEffect(() => {
        document.body.appendChild(modalContainer);
        return () => {
            document.body.removeChild(modalContainer);
        };
    }, [modalContainer]);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[#2C2F33] p-6 shadow-lg w-80">
                <h2 className="text-white text-xl mb-4">{title}</h2>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full p-2 border border-[#7289DA] rounded mb-4 bg-[#23272A] text-white outline-0"
                    placeholder="Enter text"
                />
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit(value)}
                        className="cursor-pointer px-4 py-2 bg-[#7289DA] text-white rounded hover:bg-[#7289DA]/50"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>,
        modalContainer
    );
}
