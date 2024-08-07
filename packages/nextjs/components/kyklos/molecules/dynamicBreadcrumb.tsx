import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";

const DynamicBreadcrumb = () => {
    const pathname = usePathname();
    const [breadcrumbParts, setBreadcrumbParts] = useState<string[]>([]);

    useEffect(() => {
        const pathParts = pathname.split("/").filter(Boolean);
        const baseIndex = pathParts.indexOf("homepage");
        const parts = baseIndex !== -1 ? pathParts.slice(baseIndex) : pathParts;
        setBreadcrumbParts(parts as string[]);
    }, [pathname]);

    return (
        <Breadcrumb className="mt-4 ml-8">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/homepage">Home</BreadcrumbLink>
                    {breadcrumbParts.length > 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
                {breadcrumbParts.slice(1).map((part, index) => {
                    const href = `/${breadcrumbParts.slice(0, index + 2).join("/")}`;
                    const isLast = index === breadcrumbParts.length - 2;

                    return (
                        <BreadcrumbItem key={href}>
                            {isLast ? (
                                <BreadcrumbPage>{part}</BreadcrumbPage>
                            ) : (
                                <>
                                    <BreadcrumbLink href={href}>{part}</BreadcrumbLink>
                                    <BreadcrumbSeparator />
                                </>
                            )}
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default DynamicBreadcrumb;
