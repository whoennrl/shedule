/* VSU Shedule App | Version: 2.0            */
/* Developer: whoennrl                       */
/* https://whoennrl.ru                       */

async function checkInstallation () {

}

async function checkMode () {

}

async function generateShedule (data, mode) {

}

async function initTelegram() {
    if (window.Telegram.WebApp != null && typeof window.Telegram.WebApp != undefined) {
        window.App.Start = true;
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

    } else {
        // отобразить экран что устройство не поддерживается
    }

})