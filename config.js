// Update these values to match those of your Server URL, DriveWorks Group Alias
// and Alias of the DriveApp you wish to be rendered.

const config = {
    serverUrl: "",
    groupAlias: "",
    driveAppAlias: "",
    // (Optional) Set DriveApp ping interval - in seconds
    // A DriveApp will timeout after a configured period of inactivity (see DriveWorksConfigUser.xml).
    // This function prevents a DriveApp timing out as long as the page is in view.
    // Disable the ping by changing the setting to 0
    driveAppPingInterval: 0,
    // (Optional) Configure 'Run' view
    run: {
        showWarningOnExit: false, // Toggle warning dialog when exiting "Run" view with potentially unsaved changes (where supported)
    },
};
