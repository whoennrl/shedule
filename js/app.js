//const ScheduleAPI = require("./lib")

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

    window.ScheduleAPI.init('https://vsu.whoennrl.ru/api2.php');
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
            groups.forEach(o=>{
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




})




async function initHome () {

    function generateBox(data) {

    }

    async function checkNowLesson () {


        setTimeout(checkNowLesson, 1000);
    }

    async function getWeek() {
        let shedule = (await window.ScheduleAPI.getWeek(localStorage.getItem("faculty"), localStorage.getItem('group')));
        let days = {
            'Понедельник':[],
            'Вторник':[],
            'Среда':[],
            'Четверг':[],
            'Пятница':[],
            'Суббота':[]
        }
        shedule.schedule.forEach(e=>{
            days[e.day].push(e);
        })
        return days;
    }

    let is_admin = (await window.ScheduleAPI.checkAdmin()).is_admin;
    
    let shedule = await getWeek();

    await checkNowLesson();

    console.log(shedule);


}