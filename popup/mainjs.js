const logInBtn = document.getElementById("btn1");
const downloadBtn = document.getElementById("btn2");
const connectionCheck = document.getElementById("btn3");
const statusText = document.getElementById("statusText");

logInBtn.addEventListener("click", function() {
    console.log("button clicked!");

    chrome.runtime.sendMessage({
        action: "OPEN_CANVAS_LOGIN"
    });
});

downloadBtn.disabled = true;

connectionCheck.addEventListener("click", function() {
     chrome.runtime.sendMessage(
    { action: "CHECK_CANVAS_CONNECTION" },
    function(response) {
        if (response && response.connected) {
            statusText.textContent = `Welcome, ${response.name}`;
            downloadBtn.disabled = false;
        } else {
            statusText.textContent = "Welcome! Please login to Canvas";
            downloadBtn.disabled = true;
        }
    }
    );
})