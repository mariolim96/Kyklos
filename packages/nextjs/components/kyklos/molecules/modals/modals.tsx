// components/Modal.tsx
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ModalProps, modalSelectors } from "~~/services/store/modals";

const Modal: React.FC<ModalProps> = ({ id, children }) => {
    const isOpen = modalSelectors.use.modals()[id]?.open;
    const closeModal = modalSelectors.use.closeModal();
    const modalData = modalSelectors.use.getModalData()(id);
    return (
        <Dialog.Root open={isOpen} onOpenChange={() => closeModal(id)}>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
            <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-xl font-semibold">title</Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="text-gray-500 hover:text-gray-700" onClick={() => closeModal(id)}>
                                <Cross2Icon className="w-6 h-6" />
                            </button>
                        </Dialog.Close>
                    </div>
                    <div>
                        <p>{modalData}</p>
                        {children}
                    </div>
                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
};

export default Modal;
