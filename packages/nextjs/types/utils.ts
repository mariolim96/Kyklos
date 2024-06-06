import Image from "next/image";

export type Tuple<T, MaxLength extends number = 10, Current extends T[] = []> = Current["length"] extends MaxLength
    ? Current
    : Current | Tuple<T, MaxLength, [T, ...Current]>;

export type ImageProps = Omit<React.ComponentProps<typeof Image>, "src" | "alt">;

export type ApolloResponse<T> = {
    data: T;
};
