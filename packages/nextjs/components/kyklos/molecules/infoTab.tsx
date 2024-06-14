import React from "react";
import Image from "next/image";
import Text from "~~/components/kyklos/ui/text";

interface InfoTabProps {
    // Define the props for your component here
    title?: string | React.JSX.Element;
    subTitle?: string | React.JSX.Element;
    image?: string | React.JSX.Element;
    style?: {
        subtitle?: string;
        title?: string;
    };
}

const InfoTab: React.FC<InfoTabProps> = ({ title, subTitle, image }) => {
    return (
        <div>
            <div className="flex align-baseline items-center">
                <div className="mr-1">
                    {typeof image === "string" ? <Image src={image} width="56" height={"56"} alt="Object" /> : image}
                </div>
                <div>
                    <Text element="h4" as="h4">
                        {title}
                    </Text>
                    <Text element="h4" as="h4">
                        {subTitle}
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default InfoTab;
