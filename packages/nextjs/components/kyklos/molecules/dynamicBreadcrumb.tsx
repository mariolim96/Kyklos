"use client";

import * as React from "react";
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
    const pathParts = pathname.split("/").filter(Boolean);

    // Ensure "homepage" is treated as the base/root path
    const baseIndex = pathParts.indexOf("homepage");
    const breadcrumbParts = baseIndex !== -1 ? pathParts.slice(baseIndex) : pathParts;

    return (
        <Breadcrumb className=" mt-4 ml-8 ">
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
