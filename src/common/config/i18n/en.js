// English
import { Login } from "./Login/en";
import { Home } from "./Home/en";
import { Common } from "./Common/en";
import { auth } from "./auth/en";

export const locale = {
    LOGIN: {
        ...Login,
    },
    HOME: {
        ...Home
    },
    COMMONS:{
        ...Common
    },
    AUTH: {
        ...auth
    }
}

