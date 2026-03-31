chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "OPEN_CANVAS_LOGIN") {
        chrome.tabs.create({
            url: "https://byui.instructure.com"
        });
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
                connected: true,
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

    if (message.action === "GET_CANVAS_FEED_URL") {
        getCanvasFeedUrl()
            .then((feedUrl) => {
                if (feedUrl) {
                    sendResponse({
                        success: true,
                        feedUrl: feedUrl
                    });
                } else {
                    sendResponse({
                        success: false,
                        error: "Could not find Canvas feed URL."
                    });
                }
            })
            .catch((error) => {
                console.error("Error getting Canvas feed URL:", error);
                sendResponse({
                    success: false,
                    error: "There was an error trying to get the Canvas feed URL."
                });
            });

        return true;
    }
});

async function getCanvasFeedUrl() {
    const response = await fetch("https://byui.instructure.com/calendar", {
        credentials: "include"
    });

    const html = await response.text();

    console.log("Canvas calendar HTML:", html);

    const feedUrlMatch = html.match(/https:\/\/byui\.instructure\.com\/feeds\/calendars\/[^"'\s]+\.ics/g);

    if (feedUrlMatch && feedUrlMatch.length > 0) {
        return feedUrlMatch[0];
    }

    return null;
}
