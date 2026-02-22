async function init2_1() {
    console.log("Init Functions: 2.1");

    await init_settings();
    await init_admin();

}




async function init_settings() {


    function changeSwitch(e) {
        localStorage.setItem(e.target.getAttribute("set"), e.target.checked)
    }

    console.log("[2.1] Init Settings")

    if (localStorage.getItem("install-step") == 'installed') {

        if (localStorage.getItem("set_swipes") == null) {
            localStorage.setItem("set_swipes", true);
        }

    }

    if (localStorage.getItem("set_swipes") == "true") {
        document.querySelector(".screen[screen-id='settings'] .set_swipes input").checked = true
    }

    document.querySelector(".screen[screen-id='settings'] #settings_faculty").value = localStorage.getItem("faculty");

    let groups = await window.ScheduleAPI.getGroups(localStorage.getItem("faculty"));
    let html = "<option value='0' selected disabled>Выберите</option>"
    groups.forEach(o => {
        html += "<option value='{value}'>{value}</option>".replaceAll("{value}", o.name)
    })

    document.querySelector("#settings_group").innerHTML = html;

    document.querySelector("#settings_group").value = localStorage.getItem("group")

    document.querySelector("#settings_faculty").addEventListener("selectChanged", async (e) => {
        let groups = await window.ScheduleAPI.getGroups(e.target.value);
        let html = "<option value='0' selected disabled>Выберите</option>"
        groups.forEach(o => {
            html += "<option value='{value}'>{value}</option>".replaceAll("{value}", o.name)
        })

        document.querySelector("#settings_group").innerHTML = html;
    })

    document.querySelector(".screen[screen-id='settings'] .header .backButton").addEventListener("click", () => {
        if (document.querySelector(".screen[screen-id='settings'] #settings_faculty").value != localStorage.getItem("faculty") || document.querySelector(".screen[screen-id='settings'] #settings_group").value != localStorage.getItem("group")) {
            if (document.querySelector("#settings_group").value == '0') {
                alert("Надо выбрать группу!")
            } else {
                localStorage.setItem("faculty", document.querySelector(".screen[screen-id='settings'] #settings_faculty").value);
                localStorage.setItem("group", document.querySelector(".screen[screen-id='settings'] #settings_group").value);
                document.location.reload();
            }
        } else {
            showScreen("homeboard")
        }
    })

    document.querySelector("*[action='clear-data']").addEventListener("click", ()=>{
        localStorage.clear();
        document.location.reload()
    })


    document.querySelector(".screen[screen-id='settings'] .set_swipes input").addEventListener("change", changeSwitch)

}



async function init_admin() {

    console.log("[2.1] Init Admin")

}