import supertokens from 'supertokens-web-js';
import Session from 'supertokens-web-js/recipe/session';
import ThirdParty from 'supertokens-web-js/recipe/thirdparty'

const superConfig = {
    appInfo: {
        apiDomain: "http://127.0.0.1:5000",
        apiBasePath: "/auth",
        appName: "Sebayett",
    },
    recipeList: [
        Session.init(),
        ThirdParty.init(),
    ],
    // enableDebugLogs:true,
};

const frontend_redirect = "http://127.0.0.1:5000/auth/redirect" 

export { superConfig, frontend_redirect }