// Portuguese
import { Login } from "./Login/pt-br";
import { Home } from "./Home/pt-br";
import { Common } from "./Common/pt-br";
import { auth } from "./auth/pt-br";
import { Documents } from "./documents/pt-br";

export const locale = {
    LOGIN: {
        ...Login,
    },
    HOME:{
        ...Home
    },
    COMMONS:{
        ...Common
    },
    AUTH: {
        ...auth
    },
    DOCUMENTS: {
        ...Documents
    }
}

