import { useRouter } from "next/navigation";
import NProgress from "nprogress";

export const useNavigate = () => {
    const router = useRouter();

    const { push } = router;

    router.push = (href, options) => {
        NProgress.start();
        push(href, options);
    };

    return router;
};
