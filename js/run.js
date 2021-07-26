// Get config
const SERVER_URL = config.serverUrl;
const GROUP_ALIAS = config.groupAlias;
const DRIVEAPP_ALIAS = config.driveAppAlias;

// Get session
const CURRENT_SESSION = localStorage.getItem("sessionId");
checkSession();

// Construct DriveWorks Live client
let DW_CLIENT;
function dwClientLoaded() {
    try {
        DW_CLIENT = new window.DriveWorksLiveClient(SERVER_URL);

        // Set client's session id passed from login
        DW_CLIENT._sessionId = localStorage.getItem("sessionId");
    } catch (error) {
        redirectToLogin("Cannot access client.", "error");
    }

    run();
}

// Run on load
async function run() {
    showUsername();

    try {

        // Run DriveApp
        const driveApp = await DW_CLIENT.runDriveApp(GROUP_ALIAS, DRIVEAPP_ALIAS);

        // Render DriveApp
        const driveAppOutput = document.getElementById("driveapp-output");
        await driveApp.render(driveAppOutput);

        // Attach events
        driveApp.registerSpecificationCancelledDelegate(() => handleLogout());
        driveApp.registerSpecificationClosedDelegate(() => handleLogout());

        // Remove loading state
        driveAppOutput.classList.remove("is-loading");

        // (Optional) Prevent Specification timeout
        pingDriveApp(driveApp);

    } catch (error) {
        console.log(error);

        // If authorization error, handle appropriately
        if (String(error).includes("401")) {
            redirectToLogin("Please login to view that.", "error");
            return;
        }
    }
}

/**
 * Check for stored session
 */
function checkSession() {
    // If no session is stored (e.g. not logged in), redirect to login
    if (CURRENT_SESSION === null || CURRENT_SESSION === "undefined") {
        redirectToLogin("Please login to view that.", "error");
    }
}

/**
 * Ping the running DriveApp
 *
 * A DriveApp will timeout after a configured period of inactivity (see DriveWorksConfigUser.xml).
 * This function prevents a DriveApp timing out as long as the page is in view.
 *
 * @param driveApp The DriveApp object.
 */
 function pingDriveApp(driveApp) {
    // Disable ping if interval is 0
    if (config.driveAppPingInterval === 0) {
        return;
    }

    // Ping DriveApp to reset timeout
    driveApp.ping();

    // Schedule next ping
    setTimeout(pingDriveApp, config.driveAppPingInterval * 1000, driveApp);
}

/**
 * Handle logout
 */
async function handleLogout(text = "You have been logged out.", state = "success") {
    try {
        // Logout of Group
        await DW_CLIENT.logoutGroup(GROUP_ALIAS);
        redirectToLogin(text, state);
    } catch (error) {
        console.log(error);
    }
}

// Attach logout function to button click
document.getElementById("logout-button").onclick = function() {
    handleLogout();
};

// Quick Logout (?bye URL query)
const urlQuery = new URLSearchParams(window.location.search);
if (urlQuery.has("bye")) {
    handleLogout();
}

/**
 * Set login screen message
 */
function redirectToLogin(text, state) {
    // Clear all stored credentials
    localStorage.clear();

    // Set login screen message
    setLoginMessage(text, state);

    // Redirect to login screen
    window.location.href = "index.html";
}

/**
 * Set login screen message
 */
function setLoginMessage(text, state) {
    message = {
        text: text,
        state: state
    }
    localStorage.setItem("loginNotice", JSON.stringify(message));
}

/**
 * Show username in header
 */
function showUsername() {
    const username = localStorage.getItem("sessionUser");
    if (username) {
        document.getElementById("username").textContent = username;
        document.getElementById("header-user").classList.add("is-shown");
    }
}
