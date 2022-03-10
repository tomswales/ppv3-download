const environments = ["sandbox", "live"];
let versions = [];
let selectedVersion;
let clipboard;

window.onload = function () {
    environments.forEach(env => fetchVersion(env, versions));
    const select = document.getElementById("version-select");
    select.addEventListener("change", handleSelectChange);
}

function fetchVersion(environment, versions) {
    fetch("https://resources." + environment + ".oscato.com/paymentpage/v3/version")
    .then(res => res.text())
    .then(version => {
        const trimmedVersion = version.trim()
        const versionTag = document.getElementById(environment + "-version");
        versionTag.innerHTML = trimmedVersion;
        if(!versions.find(item => item === trimmedVersion)) {
            versions.push(trimmedVersion);
        }
        buildSelectMenu(versions);
    }).catch(e => console.log(e));
}

function buildSelectMenu(versions) {
    if(versions.length > 0) {
        // Rebuild the select menu
        const select = document.getElementById("version-select");
        select.innerHTML = "";
        const initial = document.createElement("option");
        initial.value = "";
        initial.innerHTML = "Select a version";
        select.appendChild(initial)
        versions.forEach(item => {
            const newOption = document.createElement("option");
            newOption.value = item;
            newOption.innerHTML = item;
            select.appendChild(newOption);
        });
    }
    else {
        const selector = document.getElementById("select-container");
        selector.innerHTML = "";
        selector.appendChild(document.createTextNode("No versions found"))
    }
    
}

function handleSelectChange(event) {
    const selected = event.target.value;
    if(selected) {
        selectedVersion = selected;
        hideCommands();
        showCommands(selected);
        showFurtherInstructions();
    }
    else {
        hideCommands();
        hideFurtherInstructions();
        selectedVersion = undefined;
    }
}

function hideCommands() {
    const commands = document.getElementById("commands");
    commands.innerHTML = "";

    if (clipboard) {
        clipboard.destroy();
    }
}

function showCommands(version) {

    const code = document.getElementById("commands");
    code.appendChild(document.createTextNode(`mkdir -p temp-payment-widget-${version} && cd "$_" && npm init --yes\nnpm install --save op-payment-widget-v3@${version} --registry https://packagecloud.io/optile/javascript/npm/\nmv ./node_modules/op-payment-widget-v3 . && zip -r ../op-payment-widget-v3@${version}.zip op-payment-widget-v3\ncd .. && rm -rf  temp-payment-widget-${version}`));

    // Attach listeners to copy buttons
    clipboard = new ClipboardJS('.btn');

    clipboard.on('success', function(e) {
        e.trigger.setAttribute("class", "btn button is-success is-light");
        setTimeout(function() {
            e.trigger.setAttribute("class", "btn button");
        }, 1000)
    });
}

function showFurtherInstructions() {
    const downloadWidget = document.getElementById("commands-area");
    downloadWidget.setAttribute("class", "commands-area");

    const updateShop = document.getElementById("update-shop");
    updateShop.setAttribute("class", "commands-area");
}

function hideFurtherInstructions() {

    const downloadWidget = document.getElementById("commands-area");
    downloadWidget.setAttribute("class", "commands-area hidden");

    const updateShop = document.getElementById("update-shop");
    updateShop.setAttribute("class", "commands-area hidden");
}