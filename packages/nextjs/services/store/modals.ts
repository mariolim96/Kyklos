// store/modalStore.ts
import createSelectors from "./selectorGenerator";
import { create } from "zustand";

/**
 * Zustand Modal Store
 *
 * This store handles the state of multiple modals and their data.
 */

export interface ModalMeta {
    [name: string]: any;
}

export type Modal = {
    id: string;
    open: boolean;
    meta?: ModalMeta;
};
export type ModalProps = {
    id: modalsKeys;
    children?: React.ReactNode;
};

const MODALS = {
    modals: {
        id: "modals",
        open: true,
        meta: undefined,
    },
    LoginModal: {
        id: "LoginModal",
        open: false,
        meta: undefined,
    },
};
export type modalsKeys = keyof typeof MODALS;
export type ModalMap = { [key in modalsKeys]: Modal };

type newModalState = {
    modals: ModalMap;
    openModal: (id: modalsKeys, meta?: any) => void;
    closeModal: (id: modalsKeys) => void;
    getModalData: (id: modalsKeys) => any;
};

export const useModalStore = create<newModalState>(set => ({
    modals: MODALS,
    openModal: (id, meta) =>
        set(state => {
            const newModals = { ...state.modals };
            newModals[id].open = true;
            newModals[id].meta = meta;
            return { modals: newModals };
        }),
    closeModal: id =>
        set(state => {
            const newModals = { ...state.modals };
            newModals[id].open = false;
            return { modals: newModals };
        }),
    getModalData: id => (state: { modals: ModalMap }) => state.modals[id].meta,
}));

export const modalSelectors = createSelectors(useModalStore);
