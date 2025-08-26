import supertokens from 'supertokens-web-js';
import { signUp } from "supertokens-web-js/recipe/emailpassword";
import { doesEmailExist } from "supertokens-web-js/recipe/emailpassword";
import { superConfig } from "./config";

supertokens.init(superConfig);

const signUpButton = document.getElementById('signUpButton')

async function signUpClicked() {
    try {
        const email = document.getElementById('emailInput').value
        const password = document.getElementById('passwordInput').value
        // const username = document.getElementById('usernameInput').value
        // const first_name = document.getElementById('first_nameInput').value
        // const last_name = document.getElementById('last_nameInput').value
        // const discord_username = document.getElementById('discord_usernameInput').value
        // const year = document.getElementById('yearInput').value
        // const month = document.getElementById('monthInput').value
        // const day =  document.getElementById('dayInput').value
        // const date_of_birth = `${year}-${month}-${day}`
        // const gender = document.getElementById('genderInput').value
        // const country = document.getElementById('countryInput').value
        // const languages = document.getElementById('languagesInput').value

        let response = await signUp({
            formFields: [{
                id: "email",
                value: email
            }, {
                id: "password",
                value: password
            }
        ]})

        if (response.status === "FIELD_ERROR") {
            response.formFields.forEach(formField => {
                if(formField.id === "email") {
                    window.alert(formField.error)
                } else if (formField.id === "password") {
                    window.alert(formField.error)
                }
            })
        } else if (response.status === "SIGN_UP_NOT_ALLOWED") {
            window.alert(response.reason)
            console.log(response.reason)
        } else {
            window.location.href = '/'
        }

    } catch (error) {
        if (error.isSuperTokensGeneralError === true) {
            window.alert(error.message)
            console.log(error.message)
        } else {
            window.alert("Oops! Something went wrong.")
            console.log(error)
        }
    }


}

signUpButton.addEventListener("click", signUpClicked)

const emailInput = document.getElementById("emailInput")


async function checkEmail() {
    
    try {
        const email = document.getElementById("emailInput").value
        let response = await doesEmailExist({
            email
        })

        if (response.doesExist) {
            window.alert("Email Already exists. Please sign in instead.")
        }
    } catch (error) {
        if(error.isSuperTokensGeneralError === true) {
            window.alert(error.message)
        } else {
            window.alert("Oops! Something went wrong.")
            console.log(error)
        }
    }
}
// a 1 second delay after the user finished typing to check the input
let typingTimer;
function wait() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(checkEmail, 1000)
}

emailInput.addEventListener("input", wait)