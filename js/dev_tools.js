(function () {

    window.log = []

    console.log = (...params) => {
        window.log.push({
            "type": "log",
            "data": params
        })
    }
    console.warn = (...params) => {
        window.log.push({
            "type": "warn",
            "data": params
        })
    }

    console.error = (...params) => {
        window.log.push({
            "type": "error",
            "data": params
        })
    }
})()



window.addEventListener("DOMContentLoaded", () => {

    // инициализация всех ресурсов разработчика
    console.log("[DevTools]", "Начало инициализации всех блоков");

    let label_clicks = 0;

    if (localStorage.getItem("dev_mode") == null) {
        localStorage.setItem("dev_mode", "false")
    }

    if (localStorage.getItem("dev_mode") == "true") {
        document.querySelector(".screen[screen-id='homeboard'] .button[action='devmode']").classList.remove("hidden")
        document.querySelector(".screen[screen-id='homeboard'] .button[action='devmode']").addEventListener("click", () => {
            showScreen("devmode")
        })
    }

    document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='menu'] .version").addEventListener("click", () => {
        if (localStorage.getItem("dev_mode") == "false") {
            label_clicks += 1;
        } else {
            label_clicks = 0;
        }


        if (label_clicks == 10) {
            localStorage.setItem("dev_mode", "true");
            alert("Включен режим разработчика\n\nПриложение будет перезапущено")
            document.location.reload()
        }
    })


    document.querySelector('#devmode-script-path').addEventListener("change", async (e) => {
        let url = e.target.value;
        try {
            let res = fetch().then((o) => { 
                
            }).catch((e) => {
                console.error("[DevMode]", "Ошибка", "Не удалось загрузить ресурс!", url)
            })

        } catch (e) {

        }
    })





    setInterval(logUpdate, 500)


})



function logUpdate() {
    function logElement(e) {
        if (typeof e == "object") {
            e = JSON.stringify(e)
        }
        return "<span>" + e + "</span>"
    }
    let html = ""
    window.log.forEach(e => {
        html += "<div class='item " + e.type + "'> "
        html += "<img src='./imgs/" + e.type + ".png' width='20' height='20'>"
        e.data.forEach(o => {
            html += logElement(o)
        })
        html += "</div>"
    })



    if (window.loghtml != html) {
        document.querySelector(".screen[screen-id='devmode'] .logBox").innerHTML = html;
        window.loghtml = html;
    }
}