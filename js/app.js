/*
 * VSU Shedule App | Version 2.0
 * Build: [build_info]
 * Developer: @whoennrl
 * 
 * Site: https://whoennrl.ru
 */

function showScreen(screenName) {
    let bl = document.querySelectorAll(".screen[screen-id]");
    bl.forEach(e => {
        if (!e.classList.contains('hidden')) {
            e.classList.toggle("hidden")
        }
    })
    try {
        let b1 = document.querySelector(".screen[screen-id='" + screenName + "']")
        b1.classList.toggle("hidden")
    } catch {
        console.log("Экран не найден")
    }
}

window.addEventListener("DOMContentLoaded", async () => {

    if (window.Telegram.WebApp.platform == 'tdesktop') {
        if (window.Telegram.WebApp.isFullscreen) {
            window.Telegram.WebApp.exitFullscreen()
        }
    }

    try {
        window.ScheduleAPI.init('https://aurum.whoennrl.ru/api/shedule-v2/');
    } catch {
        console.log("NOT SUPPORTED!")
    }
    let banned_status = await window.ScheduleAPI.getBanStatus(window.Telegram.WebApp.initDataUnsafe.user.id);

    if (banned_status.banned) {
        console.log("Аккаунт заблокирован");
        showScreen("account-banned")
    } else {
        console.log("Аккаунт активен")

        // установка данных
        document.querySelector(".screen[screen-id='install-step-1'] .bottom .box .userBox .userText .name span").innerHTML = window.Telegram.WebApp.initDataUnsafe.user.first_name + " " + window.Telegram.WebApp.initDataUnsafe.user.last_name;
        document.querySelector(".screen[screen-id='install-step-1'] .bottom .box .userBox .userText .username").innerHTML = "@" + window.Telegram.WebApp.initDataUnsafe.user.username;
        if (document.querySelector(".screen[screen-id='install-step-1'] .bottom .box .userBox .userText .username").innerHTML == "@") {
            document.querySelector(".screen[screen-id='install-step-1'] .bottom .box .userBox .userText .username").style.display = 'none'
        } else {
            document.querySelector(".screen[screen-id='install-step-1'] .bottom .box .userBox .userText .username").style.display = 'block'
        }
        let img = document.querySelector(".screen[screen-id='install-step-1'] .bottom .box .userBox .userPic");
        img.style.background = 'url(' + window.Telegram.WebApp.initDataUnsafe.user.photo_url + ')';
        img.style.backgroundSize = "cover";

        if (window.Telegram.WebApp.initDataUnsafe.user.is_premium) {
            document.querySelector(".screen[screen-id='install-step-1'] .bottom .userBox .userText .premium").style.display = "block"
        } else {
            document.querySelector(".screen[screen-id='install-step-1'] .bottom .userBox .userText .premium").style.display = "none"
        }

        document.querySelector("#faculty-install-step-2").addEventListener("selectChanged", async (e) => {

            let groups = await window.ScheduleAPI.getGroups(e.target.value);
            let html = "<option value='0' selected disabled>Выберите</option>"
            groups.forEach(o => {
                html += "<option value='{value}'>{value}</option>".replaceAll("{value}", o.name)
            })

            document.querySelector("#group-install-step-2").innerHTML = html;

        })


        // получение статуса установки
        let install_status = localStorage.getItem("install-step");

        if (install_status == null || install_status == "step-1") {
            showScreen("install-step-1");

            document.querySelector(".screen[screen-id='install-step-1'] .bottom .button").addEventListener("click", () => {
                showScreen("install-step-2")

            })
        } else {
            let mode = localStorage.getItem("mode");
            if (mode == 'student') {

                showScreen("homeboard");

                await initHome();

            } else if (mode == 'teacher') {
                // ! РЕАЛИЗОВАТЬ РЕЖИМ ДЛЯ ПРЕПОДАВАТЕЛЯ
            } else {
                localStorage.setItem("install-step", 'step-1')
                document.location.reload();
            }
        }

        document.querySelector(".screen[screen-id='install-step-2'] .bottom .button").addEventListener("click", async () => {
            let mode = document.querySelector("#mode-install-step-2").value;
            if (mode == "Студент") {
                // ? студент
                let faculty = document.querySelector("#faculty-install-step-2").value;
                let group = document.querySelector("#group-install-step-2").value;

                console.log(mode, faculty, group)

                localStorage.setItem("install-step", 'installed');
                localStorage.setItem("mode", 'student');
                localStorage.setItem("faculty", faculty);
                localStorage.setItem('group', group);

                document.location.reload();

            } else {
                // ! преподаватель
                // TODO: реализовать функционал 
            }
        })

    }

    let menu_home = document.querySelectorAll(".screen[screen-id='homeboard'] .bottom .bottomMenu .item");
    menu_home.forEach(e => {
        e.addEventListener("click", () => {
            menu_home.forEach(o => {
                o.classList.remove("selected")
            })
            e.classList.add('selected');
            let parts = document.querySelectorAll(".screen[screen-id='homeboard'] .screen-part");
            parts.forEach(o => {
                if (!o.classList.contains('hidden')) {
                    o.classList.add("hidden")
                }
            })
            let part = document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='" + e.getAttribute('part') + "']")
            part.classList.remove('hidden')
        })
    })




})




async function initHome() {



    function parseDay(data) {
        function generateBox(d) {
            let html = "";
            console.log(d);
            let types = "";
            let color = ""
            if (d.subject.includes("(Лек)")) {
                types = "Лекция";
                color = "#007AFF"
                d.subject = d.subject.replace("(Лек)", "")
            }
            if (d.subject.includes("(Лаб)")) {
                types = "Лабораторная работа";
                color = "#34C759"
                d.subject = d.subject.replace("(Лаб)", "")
            }
            if (d.subject.includes("(ПЗ)")) {
                types = "Практическое занятие";
                color = "#FFCC00";
                d.subject = d.subject.replace("(ПЗ)", "")
            }
            html += "<div class='shedule-box' id='shedule-[id]' hash='[hash]'>".replace("[hash]", d.hash).replace("[id]", d.id);
            html += "<div class='line' style='background: [color];'></div>".replace("[color]", color)
            html += "<div class='block'>"
            html += "<div class='top' style='color: [color];'>[type]</div>".replace("[color]", color).replace("[type]", types)
            html += "<div class='middle'>"
            html += "<div class='lesson'>"
            html += "<div class='name'>" + d.subject + "</div>"
            html += "<div class='classroom'>" + d.classroom + "</div>"
            html += "</div>"
            html += "<div class='time'>"
            html += "<div class='start'>" + d.time.replace("(", "").replace(")", "").split("-")[0] + "</div>"
            html += "<div class='end'>" + d.time.replace("(", "").replace(")", "").split("-")[1] + "</div>"
            html += "</div>"
            html += "</div>"

            html += "<div class='bottom-box'>"
            html += "<div class='teacher-picture' style='width: 25px; height: 25px; background: [teacher-pick] no-repeat; background-size: cover; background-position: top; border-radius: 100%;'></div>"
            html += "<div class='teacher'>" + d.teacher + "</div>"
            html += "</div>"
            if (d.teacher_photo == null) {
                html = html.replace("[teacher-pick]", "url(./imgs/user.png)")
            } else {
                html = html.replace("[teacher-pick]", "url(" + d.teacher_photo + ")")
            }

            if (d.is_combined) {
                html += "<div class='combined'>"
                d.combined_main_groups.forEach(o => {
                    html += "<div class='group'>" + o + "</div>"
                })
                html += "</div>"
            }

            html += "</div>"
            html += "</div>"
            return html;
        }
        let html = ""
        data.forEach(e => {
            html += generateBox(e)
        })
        return html;
    }

    async function checkNowLesson() {
        let now = (await window.ScheduleAPI.getCurrentLesson(localStorage.getItem("faculty"), localStorage.getItem('group')));

        setTimeout(checkNowLesson, 10000);
    }


    async function getWeek() {
        let shedule = (await window.ScheduleAPI.getWeek(localStorage.getItem("faculty"), localStorage.getItem('group')));
        let days1 = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
        let days = [[], [], [], [], [], []];
        let today = [];
        let lastD = new Date();
        let last = "";
        let month = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
        last += lastD.getDate() + " ";
        last += month[lastD.getMonth()] + " ";
        last += lastD.getFullYear() + " г."
        let dnum = 0
        shedule.schedule.forEach(e => {
            days[days1.indexOf(e.day)].push(e);
            if (e.date == last) {
                today.push(e);
                dnum = days1.indexOf(e.day)
            }
        })
        return [days, dnum];
    }

    let is_admin = (await window.ScheduleAPI.checkAdmin()).is_admin;

    let shedule = await getWeek();

    await checkNowLesson();

    console.log(shedule);
    let dnum = shedule[1]
    let today = shedule[0][dnum];

    console.log(shedule[0][0])
    let html = parseDay(today);

    document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").innerHTML = html;


}