"use client";

import React from "react";
import MultistepModal from "../../organism/multistepModal";
import { StepItem, useStepper } from "../../ui/stepper";
import DefaultModal from "../defaultModal";
import CarbonTonneCard from "../swapper";
import { modalSelectors, modalsKeys } from "~~/services/store/modals";

const steps = [
    { label: "Step 1", id: "1", icon: () => <div>120</div> },
    { label: "Step 2", icon: () => <div>120</div> },
] satisfies StepItem[];
const Modal = ({ id }: { id: modalsKeys; children?: React.ReactNode }) => {
    const modalData = modalSelectors.use.getModalData()(id);

    return (
        <DefaultModal id={id}>
            <div className="bg-white  rounded-xl shadow-lg  w-[700px] h-[600px] ">
                <MultistepModal
                    steps={steps}
                    // footer={<Footer />}
                    views={[
                        <div key={1} className="p-4">
                            <CarbonTonneCard></CarbonTonneCard>
                        </div>,
                        <div key={2}>v2</div>,
                        <div key={3}>v3</div>,
                    ]}
                />
            </div>
        </DefaultModal>
    );
};

export default Modal;
