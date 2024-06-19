import React from "react";
import dynamic from "next/dynamic";
import { modalsKeys } from "~~/services/store/modals";

interface ILazyComponentProps {
    filename: modalsKeys;
}

export function LazyComponent({ filename }: ILazyComponentProps) {
    const Component = dynamic<{ id: string }>(() => import(`./${filename}.tsx`));
    return <Component id={filename}></Component>;
}
