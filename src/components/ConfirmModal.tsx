'use client';

import { createPortal } from 'react-dom';

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-[#2C2F33] p-6 shadow-lg w-80">
                <p className="text-white text-lg mb-4">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="cursor-pointer px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="cursor-pointer px-4 py-2 bg-[#7289DA] text-white rounded hover:bg-[#7289DA]/50"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
