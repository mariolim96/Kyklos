import { LazyComponent } from "./kyklos/molecules/modals/lazyComponent";
import { modalSelectors, modalsKeys } from "~~/services/store/modals";

interface IModalProviderProps {
    children: React.ReactNode;
}

export function ModalProvider(props: IModalProviderProps) {
    const modalsSelector = modalSelectors.use.modals();
    const modals = Object.keys(modalsSelector).filter(id => modalsSelector[id as modalsKeys].open);

    return (
        <>
            {modals.map(filename => (
                <LazyComponent key={filename} filename={filename as modalsKeys} {...props} />
            ))}
            {props.children}
        </>
    );
}
