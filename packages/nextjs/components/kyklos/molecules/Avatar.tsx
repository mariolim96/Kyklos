import { Avatar, AvatarFallback } from "../ui/avatar";

const getAvatarFallback = (src: string) => {
    if (!src) return "";
    const words = src.split(" ");
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

export function AvatarImage(props: { src: string; alt?: string }) {
    const avatarFallbackVal = getAvatarFallback(props.src);
    return (
        <Avatar>
            <AvatarFallback className="bg-overlay-focus  text-overlay-content">{avatarFallbackVal}</AvatarFallback>
        </Avatar>
    );
}
