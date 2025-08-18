import supertokens from 'supertokens-web-js';
import { superConfig } from './config.js';
import { signInAndUp } from 'supertokens-web-js/recipe/thirdparty';


supertokens.init(superConfig);

async function handleDiscordCallback() {
    try {
        const response = await signInAndUp();

        if (response.status === "OK") {
            console.log(response.user)
            if (response.createdNewRecipeUser && response.user.loginMethods.length === 1) {

            } else {

            }
            window.location.assign("/")
        } else if (response.status === "SIGN_IN_UP_NOT_ALLOWED") {
            console.log("Sign Up is Not Allowed")
            window.alert(response.reason)
        } else {
            console.log("No email provided by social login. Please use another form of login")

            window.alert("No email provided by social login. Please use another form of login");
            window.location.assign("/signin")
        }
    } catch (error) {
        console.log(error)
        if(error.isSuperTokensGeneralError === true) {
            console.log(error.message)
            window.alert(error.message)
        } else {
            console.log(error)
            window.alert("Oops! Something went wrong.")
        }
    }
}

window.addEventListener('load', handleDiscordCallback)