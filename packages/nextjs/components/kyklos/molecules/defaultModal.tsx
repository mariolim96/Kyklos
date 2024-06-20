"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
// import { Cross2Icon } from "@radix-ui/react-icons";
import { modalSelectors, modalsKeys } from "~~/services/store/modals";

const DefaultModal = ({ id, children }: { id: modalsKeys; children?: React.ReactNode }) => {
    console.log("id:", id);
    const isOpen = modalSelectors.use.modals()[id]?.open;
    const closeModal = modalSelectors.use.closeModal();
    return (
        <Dialog.Root open={isOpen} onOpenChange={() => closeModal(id)}>
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-40" />
            <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">{children}</Dialog.Content>
        </Dialog.Root>
    );
};

export default DefaultModal;
