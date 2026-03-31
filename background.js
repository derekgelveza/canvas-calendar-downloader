chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "OPEN_CANVAS_LOGIN") {
        chrome.tabs.create({
            url: "https://byui.instructure.com"
        })
    }

    if (message.action === "CHECK_CANVAS_CONNECTION") {
        fetch("https://byui.instructure.com/api/v1/users/self", {
            method: "GET",
            credentials: "include"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Not connected to Canvas");
            }
            return response.json();
        })
        .then(userData => {
            sendResponse({
                connected:true,
                name: userData.name
            });
        })
        .catch(error => {
            console.log("Canvas connection failed:", error);

            sendResponse({
                connected: false
            });
        });

        return true;
    }
})