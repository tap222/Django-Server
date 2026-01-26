import supertokens from 'supertokens-web-js';
import Session from "supertokens-web-js/recipe/session";
import { superConfig } from "./config";

supertokens.init(superConfig);

const authButton = document.getElementById("authButton")


// This function is to check if a session exists in the client
async function sessionExist() {
    try{
        if (await Session.doesSessionExist()) {
            
            return true
            // user is logged in
        } else {
            return false
            // user has not logged in yet
        }
    } catch (error) {
        return error
    }
}

// This function is to log the user out of a the client
async function logout() {
    await Session.signOut();
    window.location.href = '/'; // redirect to home page
}


if (await sessionExist() === true) {
    authButton.innerHTML = `
            <a id='logOutButton'
            class="lg:block py-2 ml-4 mr-4 px-4 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600"
            >Log Out</a>
            <a
            href="/dashboard"
            class="lg:block py-2 ml-4 mr-4 px-4 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600"
            >Dashboard</a>
            `

} else {
    authButton.innerHTML = `
            <a id='signInButton'
            href="/signin"
            class="lg:block py-2 ml-4 px-4 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600"
            >Sign In<a>
            `
}

let logOutButton = document .getElementById("logOutButton")
logOutButton.addEventListener("click", logout)


