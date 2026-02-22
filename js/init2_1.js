async function init2_1() {
    console.log("Init Functions: 2.1");

    await init_settings();
    if (window.is_admin) {
        await init_admin();
    }

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

    document.querySelector("*[action='clear-data']").addEventListener("click", () => {
        localStorage.clear();
        document.location.reload()
    })


    document.querySelector(".screen[screen-id='settings'] .set_swipes input").addEventListener("change", changeSwitch)

}



async function init_admin() {

    console.log("[2.1] Init Admin")

    let devices_info = await window.ScheduleAPI.getPlatformStats();
    //let hour_stats = await window.ScheduleAPI.getHourlyStats();
    //console.log(hour_stats)
    let data = {}
    data.backgroundColor = "rgb(28, 28, 30)",
        data.labels = [];
    data.datasets = []
    data.datasets.push({
        label: "Platforms",
        data: []
    })

    let total_users = 0;
    devices_info.forEach(e => {
        data.labels.push(e.platform)
        data.datasets[0].data.push(e.user_count)
    })


    let devices = new Chart(document.querySelector("#chart-devices").getContext("2d"), {
        type: 'bar',
        data: data
    })



    let l = await window.ScheduleAPI.getAllUsers();
    total_users = l.length;
    document.querySelector("*[dataset='all_users']").innerHTML = total_users

    function generateUserBox(data) {
        let html = "";
        html += "<div class='user' search-string='[first_name] [last_name] [username] [user_id]' user-id='[user_id]'>"
        html += "<div class='left'>"
        html += "<div class='name'>[first_name] [last_name]</div>"
        if (data.username != null) {
            html += "<div class='username'>@[username]</div>"
        }
        html += "<div class='last_seen'>[last_seen]</div>"
        html += "<div class='userid'>[user_id]</div>"
        html += "</div>"
        html += "<div class='right'>"
        if (data.is_banned) {
            html += "<div class='button-mini unban' uid='[user_id]'>Разблокировать</div>"
        } else {
            html += "<div class='button-mini ban' uid='[user_id]'>Заблокировать</div>"
        }


        html += "</div>"
        html += "</div>"

        html = html.replaceAll("[first_name]", data.first_name)
        html = html.replaceAll("[last_name]", data.last_name)
        html = html.replaceAll("[username]", data.username)
        html = html.replaceAll("[user_id]", data.user_id)
        html = html.replaceAll("[last_seen]", data.last_seen)
        return html
    }
    let html = ""
    l.forEach(user => {
        html += generateUserBox(user)
    })

    setInterval(function () {
        let search = document.querySelector("#users_search").value;
        if (search != "") {
            search = search.replaceAll(" ", "");
            console.log(search)
            let bl = document.querySelectorAll(".screen[screen-id='admin'] .allUsers .user");
            bl.forEach(e => {
                e.classList.remove("hidden");
                if (!e.getAttribute("search-string").includes(search)) {
                    e.classList.add("hidden")
                }
            })
        } else {
            let bl = document.querySelectorAll(".screen[screen-id='admin'] .allUsers .user");
            bl.forEach(e => {
                e.classList.remove("hidden")
            })
        }
    }, 100)

    

    document.querySelector(".screen[screen-id='admin'] .content .allUsers").innerHTML = html;

    let bl = document.querySelectorAll(".screen[screen-id='admin'] .allUsers .user .button-mini");
    bl.forEach(e => {
        e.addEventListener("click", async ()=>{
            let id = e.getAttribute("uid");
            let banned = await window.ScheduleAPI.getBanStatus(id);
            if (banned.banned) {
                e.classList.remove("unban")
                e.classList.add("ban")
                e.innerHTML = "Заблокировать"
                await window.ScheduleAPI.unbanUser(id)
            } else {
                e.classList.remove("ban")
                e.classList.add("unban")
                e.innerHTML = "Разблокировать"
                await window.ScheduleAPI.banUser(id, null)
            }
        })
    })



}