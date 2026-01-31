/* VSU Shedule App | Version: 2.0            */
/* Developer: whoennrl                       */
/* https://whoennrl.ru                       */

async function checkInstallation () {
    let variables = ['installed', 'teacher', 'faculty', 'group', 'mode'];
    let installed = 0;
    variables.forEach(e=>{
        if (localStorage.getItem(e) != null) {
            installed += 1;
        }
    })
    if (installed == variables.length+1) {
        // установлено
        window.App.installed = true;
    } else {
        //не установлено
        window.App.installed = false;
    }
}

async function checkMode () {

}

async function generateShedule (data, mode) {

}

async function initTelegram() {
    if (window.Telegram.WebApp != null && typeof window.Telegram.WebApp != undefined) {
        window.App.Start = true;
        window.App.Telegram.haptic = ()=>{window.Telegram.WebApp.HapticFeedback.impactOccurred("light")}
        // Настройка отображения приложения
        window.Telegram.WebApp.lockOrientation();
        window.Telegram.WebApp.disableVerticalSwipes();
        if (!["macos", "webk", "weba", "tdesktop"].includes(window.Telegram.WebApp.platform)) {
            window.Telegram.WebApp.requestFullscreen();
        }
        // Получение данных пользователя
        window.App.Telegram.username = window.Telegram.WebApp.initDataUnsafe.user.username;
        window.App.Telegram.first_name = window.Telegram.WebApp.initDataUnsafe.user.first_name;
        window.App.Telegram.last_name = window.Telegram.WebApp.initDataUnsafe.user.last_name;
        window.App.Telegram.lang = window.Telegram.WebApp.initDataUnsafe.user.language_code;
        window.App.Telegram.photo_url = window.Telegram.WebApp.initDataUnsafe.user.photo_url;
        window.App.Telegram.id = window.Telegram.WebApp.initDataUnsafe.user.id;
        window.App.Telegram.is_premium = window.Telegram.WebApp.initDataUnsafe.user.is_premium;
        window.App.Telegram.platform = window.Telegram.WebApp.platform;
        window.App.Telegram.version = window.Telegram.WebApp.version;
    }
}

async function initApp () {
    window.App = {};
    window.App.shedule = {};
    window.App.Telegram = {};
    window.App.Start = false;
}

async function initAnalytics () {

}

async function getUpdates () {

}

window.addEventListener("DOMContentLoaded", async function () {

    // Запуск приложения
    await initApp();
    await initTelegram();

    if (window.App.Start) {
        await checkInstallation();
        if (window.App.installed) {
            // установлено
        } else {
            // не установлено
        }

    } else {
        // отобразить экран что устройство не поддерживается
    }

})