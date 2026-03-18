window.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("install-step") == "installed") {
        // инициализация профилей

        let allKeys = Object.keys(localStorage);
        let profiles = {}

        allKeys.forEach(e => {
            if (e.includes("profile") && e.includes("name")) {
                console.log(e)
                profiles[e.split("profile")[1].split("name")[0]] = localStorage.getItem(e)
            }
        })

        window.profiles = profiles;

        generateProfilesBoxes();

        (async function () {
            let allTeachers = await window.ScheduleAPI.getTeachers();
            let allTCHtml = "<option value='0' selected disabled>Выберите</option>"
            allTeachers.forEach(e => {
                allTCHtml += "<option value='{value}'>{value}</option>".replaceAll("{value}", e.teacher)
            })
            document.querySelector("#teacher-create-profile").innerHTML = allTCHtml
        })()

        document.querySelectorAll("*[replace='profile']").forEach(e => {
            e.innerHTML = localStorage.getItem("profile" + localStorage.getItem("current_profile") + "name")
        })

        if (localStorage.getItem("current_profile") == "default") {
            document.querySelector(".screen[screen-id='settings'] *[action='delete-profile']").style.display = 'none'
        }

        document.querySelector(".screen[screen-id='homeboard'] .profiles .buttonPro").addEventListener("click", () => {
            showScreen("create-profile")
        })

        document.querySelector("#mode-create-profile").addEventListener("selectChanged", (e) => {
            let mode = e.target.value;
            let bls = document.querySelectorAll(".screen[screen-id='create-profile'] *[imode]")
            bls.forEach(e => {
                e.classList.add("hidden")
            })
            document.querySelectorAll(".screen[screen-id='create-profile'] *[imode='" + mode + "']").forEach(e => {
                e.classList.remove("hidden")
            })
        })

        document.querySelector("#faculty-create-profile").addEventListener("selectChanged", async (e) => {

            let groups = await window.ScheduleAPI.getGroups(e.target.value);
            let html = "<option value='0' selected disabled>Выберите</option>"
            groups.forEach(o => {
                html += "<option value='{value}'>{value}</option>".replaceAll("{value}", o.name)
            })
            document.querySelector("#group-create-profile").innerHTML = html;
            updateOptions(document.querySelector("#group-create-profile"))

        })

        document.querySelector("*[action='delete-profile']").addEventListener("click", ()=>{
            let con = confirm("Вы уверены что хотите удалить профиль \"{profile}\"?".replace("{profile}", localStorage.getItem("profile" + localStorage.getItem("current_profile") + "name")))
            if (con) {
                let id = localStorage.getItem("current_profile");
                if (localStorage.getItem("profile" + id + "mode") == "student") {
                    localStorage.removeItem("profile" + id + "name")
                    localStorage.removeItem("profile" + id + "mode")
                    localStorage.removeItem("profile" + id + "faculty")
                    localStorage.removeItem("profile" + id + "group")
                } else {
                    localStorage.removeItem("profile" + id + "name")
                    localStorage.removeItem("profile" + id + "mode")
                    localStorage.removeItem("profile" + id + "teacher")
                }
                localStorage.setItem("current_profile", "default")
                document.location.reload()
            }
        })

        document.querySelector("*[action='crt-profile']").addEventListener("click", () => {

            let mode = document.querySelector("#mode-create-profile").value;
            let name = document.querySelector("#name-create-profile").value;
            let faculty = document.querySelector("#faculty-create-profile").value;
            let group = document.querySelector("#group-create-profile").value;
            let teacher = document.querySelector("#teacher-create-profile").value;

            if (mode == "student") {
                if (name.trim().length <= 3) {
                    alert("Название: требуется ввести более 3х символов")
                } else {
                    if (faculty == "0" || group == "0") {
                        alert("Требуется выбрать факультет и группу")
                    } else {
                        let id = localStorage.getItem("current_profile_id");
                        localStorage.setItem("profile" + id + "name", name);
                        localStorage.setItem("current_profile_id", (Number(localStorage.getItem("current_profile_id")) + 1).toString());
                        localStorage.setItem("profile" + id + "mode", "student")
                        localStorage.setItem("profile" + id + "faculty", faculty)
                        localStorage.setItem("profile" + id + "group", group);
                        document.location.reload()
                    }
                }
            } else {
                if (name.trim().length <= 3) {
                    alert("Название: требуется ввести более 3х символов")
                } else {
                    if (teacher == "0" ) {
                        alert("Требуется выбрать преподавателя")
                    } else {
                        let id = localStorage.getItem("current_profile_id");
                        localStorage.setItem("profile" + id + "name", name);
                        localStorage.setItem("current_profile_id", (Number(localStorage.getItem("current_profile_id")) + 1).toString());
                        localStorage.setItem("profile" + id + "mode", "teacher")
                        localStorage.setItem("profile" + id + "teacher", teacher)
                        document.location.reload()
                    }
                }
            }

        })



    }

})

function changeProfile(el) {
    let profileId = el.getAttribute("profileID");
    console.log("[Change Profile] Profile ID:", profileId)
    if (profileId != localStorage.getItem("current_profile")) {
        localStorage.setItem("current_profile", profileId);
        document.location.reload();
    }
}

function generateProfilesBoxes() {

    function generateBox(d) {
        let html = "";

        html += "<div class='profile {selected}' onclick='changeProfile(this)' profileID='" + d + "'>" + window.profiles[d] + "</div>"

        if (localStorage.getItem("current_profile") == d) {
            html = html.replace("{selected}", "selected")
        } else {
            html = html.replace("{selected}", "")
        }

        return html;
    }

    let html = ""

    Object.keys(window.profiles).forEach(e => {
        html += generateBox(e);
    })

    document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='menu'] .profiles .allProfiles").innerHTML = html;
}