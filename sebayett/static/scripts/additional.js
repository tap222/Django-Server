import Session from 'supertokens-web-js/recipe/session';

async function doesSessionExist() {
    if (await Session.doesSessionExist()) {
        // user is logged in
    } else {
        // user has not logged in yet
    }
}