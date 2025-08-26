import { sendPasswordResetEmail } from "supertokens-web-js/recipe/emailpassword";
import supertokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdParty from 'supertokens-web-js/recipe/thirdparty'
import EmailPassword from 'supertokens-web-js/recipe/emailpassword'

supertokens.init({
    appInfo: {
        apiDomain: "127.0.0.1:3000",
        apiBasePath: "/auth",
        appName: "Sebayett",
    },
    recipeList: [
        Session.init(),
        EmailPassword.init()
        // ThirdParty.init()
    ],
});


const submitButton = document.getElementById('submitButton')

async function resetPassword() {
    try {
        let email = document.getElementById('emailInput').value
        let response = await sendPasswordResetEmail({
            formFields : [{
                id: "email",
                value: email
            }]
        });

        if (response.status === "FIELD_ERROR") {
            response.formFields.forEach(formField => {
                if(formField.id === "email") {
                    window.alert(formField.error)
                }
            })
        } else if (response.status === "PASSWORD_RESET_NOT_ALLOWED"){
          // for a special case of automatic account linking  
        } else {
            window.alert("Please check your email for the password reset link")
        }

    } catch (error) {
        if(error.isSuperTokensGeneralError === true) {
            console.log(error.message)
            window.alert(error.message);
        } else {
            console.log(error.message)
            window.alert("Oops! Something went wrong.")
        }
    }
}

submitButton.addEventListener('click', resetPassword)