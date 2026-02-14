//const ScheduleAPI = require("./lib")

function showScreen (screenName) {
    let bl = document.querySelectorAll(".screen[screen-id]");
    bl.forEach(e=>{
        if (!e.classList.contains('hidden')) {
            e.classList.toggle("hidden")
        }
    })
    try {let b1 = document.querySelector(".screen[screen-id='" + screenName +"']")
    b1.classList.toggle("hidden")} catch {
        console.log("Экран не найден")
    }
}

window.addEventListener("DOMContentLoaded", async () => {

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
        img.style.background = 'url(' + window.Telegram.WebApp.initDataUnsafe.user.photo_url +')';
        img.style.backgroundSize = "cover";

        if (window.Telegram.WebApp.initDataUnsafe.user.is_premium) {
            document.querySelector(".screen[screen-id='install-step-1'] .bottom .userBox .userText .premium").style.display = "block"
        } else {
            document.querySelector(".screen[screen-id='install-step-1'] .bottom .userBox .userText .premium").style.display = "none"
        }


        // получение статуса установки
        let install_status = window.Telegram.Utils.sessionStorageGet("install-step");

        if (install_status == null || install_status == "step-1") {
            showScreen("install-step-2");
            document.querySelector(".screen[screen-id='install-step-1'] .bottom .button").addEventListener("click", ()=>{
                showScreen("install-step-2")
                
            })

        } 

    }

    
    

})