import supertokens from 'supertokens-web-js';
import { getAuthorisationURLWithQueryParamsAndSetState } from "supertokens-web-js/recipe/thirdparty";

import { superConfig, frontend_redirect } from "./config";


supertokens.init(superConfig);


async function discordSignInClicked() {
    try {
        const authUrl = await getAuthorisationURLWithQueryParamsAndSetState({
            thirdPartyId: "discord",
            frontendRedirectURI: frontend_redirect,
        });

        window.location.assign(authUrl);
    } catch (error) {
        if(error.isSuperTokensGeneralError === true) {
            window.alert(error.message)
        } else {
            console.log(error)
            window.alert("Oops! Something went worng.")
        }
    }
}

const signInAndUp = document.getElementById("signInAndUp")


signInAndUp.addEventListener('click', discordSignInClicked)