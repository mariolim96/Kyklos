import React from "react";
import Image from "next/image";

type ImageProps = Omit<React.ComponentProps<typeof Image>, "src" | "alt">;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Loader = (props: ImageProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (
        // <Image
        //   className="animate-spin m-l-[auto"
        //   width={25}
        //   height={25}
        //   src={"https://www.svgrepo.com/show/448500/loading.svg"}
        //   alt="Loading icon"
        //   {...props}
        // ></Image>
        <span className="loading loading-spinner loading-md"></span>
    );
};

export default Loader;
