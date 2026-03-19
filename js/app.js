/*
 * ВГУ Расписание | Version [build_version]
 * Build: [build_info]
 * Developer: @whoennrl
 * 
 * Site: https://whoennrl.ru
 */

window.mode = 'local' // ! "production" or "local"

function showScreen(screenName) {

    if (["settings", "admin", 'premium', "create-profile"].includes(screenName)) {
        window.Telegram.WebApp.BackButton.show()
        window.Telegram.WebApp.BackButton.onClick(() => {

            if (["settings"].includes(screenName)) {
                if (localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "student") {
                    if (document.querySelector(".screen[screen-id='settings'] #settings_faculty").value != localStorage.getItem("profile" + localStorage.getItem("current_profile") + "faculty") || document.querySelector(".screen[screen-id='settings'] #settings_group").value != localStorage.getItem("profile" + localStorage.getItem("current_profile") + "group")) {
                        if (document.querySelector("#settings_group").value == '0') {
                            alert("Надо выбрать группу!")
                        } else {
                            localStorage.setItem("profile" + localStorage.getItem("current_profile") + "faculty", document.querySelector(".screen[screen-id='settings'] #settings_faculty").value);
                            localStorage.setItem("profile" + localStorage.getItem("current_profile") + "group", document.querySelector(".screen[screen-id='settings'] #settings_group").value);
                            document.location.reload();
                        }
                    } else {
                        showScreen("homeboard")
                    }
                } else {
                    showScreen("homeboard")
                }


            } else {
                showScreen("homeboard")
            }


        })
    } else {
        window.Telegram.WebApp.BackButton.hide();
    }



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

window.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".screen[screen-id='critical-error'] *[action='reload']").addEventListener("click", () => {
        document.location.reload()
    })
    document.querySelector(".screen[screen-id='critical-error'] *[action='clear-data']").addEventListener("click", () => {
        localStorage.clear();
        document.location.reload()
    })
    try {
        conLoaded()
    } catch {
        showScreen('critical-error')
        window.Telegram.WebApp.SettingsButton.hide()
        window.Telegram.WebApp.BackButton.hide()

    }
})






async function conLoaded() {

    if (['ios', 'android'].includes(window.Telegram.WebApp.platform)) {
        window.Telegram.WebApp.requestFullscreen()
        document.body.setAttribute("platform", "mobile")
    } else {
        document.body.setAttribute("platform", "desktop")
    }

    window.Telegram.WebApp.disableVerticalSwipes();



    if (window.mode == "production") {
        window.ScheduleAPI.init('https://aurum.whoennrl.ru/api/shedule-v2/index.php');
    } else if (window.mode == "local") {
        window.ScheduleAPI.init('https://aurum.whoennrl.ru/api/shedule-v2/local.php');
    } else {
        alert("Режим работы не определен, запуск приостановлен")
        return
    }

    await window.ScheduleAPI.analytics(window.Telegram.WebApp.platform, window.Telegram.WebApp.version)

    let banned_status;
    try {
        banned_status = await window.ScheduleAPI.getBanStatus(window.Telegram.WebApp.initDataUnsafe.user.id);
    } catch {
        console.log("NOT SUPPORTED!")
        showScreen("unsupported");
        return
    }


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

        let allTeachers = await window.ScheduleAPI.getTeachers();
        //console.log(allTeachers)
        let allTCHtml = "<option value='0' selected disabled>Выберите</option>"
        allTeachers.forEach(e => {
            allTCHtml += "<option value='{value}'>{value}</option>".replaceAll("{value}", e.teacher)
        })
        document.querySelector("#teacher-install-step-2").innerHTML = allTCHtml

        document.querySelector("#mode-install-step-2").addEventListener("selectChanged", async (e) => {

            // проверяем режим
            let mode = e.target.value;

            //console.log(mode);

            let allDmod = document.querySelectorAll(".screen[screen-id='install-step-2'] *[dmode]");

            if (mode == "student") {
                allDmod.forEach(e => {
                    if (e.getAttribute("dmode") != "student") {
                        e.classList.add("hidden")
                    } else {
                        e.classList.remove("hidden")
                    }
                })
            } else {
                allDmod.forEach(e => {
                    if (e.getAttribute("dmode") != "teacher") {
                        e.classList.add("hidden")
                    } else {
                        e.classList.remove("hidden")
                    }
                })
            }

        })


        // получение статуса установки
        let install_status = localStorage.getItem("install-step");

        if (install_status == null || install_status == "step-1") {
            showScreen("install-step-1");

            document.querySelector(".screen[screen-id='install-step-1'] .bottom .button").addEventListener("click", () => {
                showScreen("install-step-2")

            })
        } else {
            let mode = localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode");
            if (mode == 'student') {

                showScreen("homeboard");
                initHome();

            } else if (mode == "teacher") {

                showScreen("homeboard");
                initHome();

            } else {
                localStorage.setItem("install-step", 'step-1')
                document.location.reload();
            }
        }

        document.querySelector(".screen[screen-id='install-step-2'] .bottom .button").addEventListener("click", async () => {

            let faculty = document.querySelector("#faculty-install-step-2").value;
            let group = document.querySelector("#group-install-step-2").value;
            let mode = document.querySelector("#mode-install-step-2").value;
            let teacher = document.querySelector("#teacher-install-step-2").value;



            if (mode == "student") {
                if (faculty == "0") return;
                if (group == "0") return;
                localStorage.setItem("current_profile", "default")
                localStorage.setItem("install-step", 'installed');
                localStorage.setItem("profiledefaultmode", 'student');
                localStorage.setItem("profiledefaultfaculty", faculty);
                localStorage.setItem('profiledefaultgroup', group);
                localStorage.setItem("profiledefaultname", "По умолчанию");
                localStorage.setItem("current_profile_id", "0");

                document.location.reload();
            } else {
                if (teacher == "0") return;
                localStorage.setItem("current_profile", "default")
                localStorage.setItem("profiledefaultmode", 'teacher');
                localStorage.setItem("profiledefaultteacher", teacher);
                localStorage.setItem("install-step", 'installed');
                localStorage.setItem("profiledefaultname", "По умолчанию");
                localStorage.setItem("current_profile_id", "0");

                document.location.reload();
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





}


async function initHome() {

    let home = document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home']");

    let pointerStart = 0;
    let anPoinLs = 0;
    let anPoinSt = 0;

    function handleAn(e) {


        let swipes_set = localStorage.getItem("set_swipes");
        if (swipes_set == null) return;
        if (swipes_set == "false") return;

        if (e.type == "touchstart") {
            anPoinSt = e.touches[0].screenX;

        }
        if (e.type == "touchmove") {
            anPoinLs = e.touches[0].screenX;
        }
        if (e.type == "touchend") {
            anPoinMv = false;

            if (anPoinSt + 150 < anPoinLs) {
                dnum -= 1;
                if (dnum < 0) {
                    dnum = 5;
                }
                document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").scrollTo(0, 0)
            }
            if (anPoinSt - 150 > anPoinLs) {
                dnum += 1;
                if (dnum > 5) {
                    dnum = 0
                }
                document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").scrollTo(0, 0)
            }

            selectors.forEach(o => {
                if (o.classList.contains('selected')) { o.classList.remove("selected") }
            })
            document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .daySelector .item[dnum='" + dnum + "']").classList.add("selected");
            let html = parseDay(shedule[0][dnum]);
            document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").innerHTML = html;
            updateLesson();

            try {
                if (localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "student") {
                    document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = shedule[0][dnum][0].date;
                } else {
                    document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = shedule[0][dnum][0].date + " | " + localStorage.getItem("profile" + localStorage.getItem("current_profile") + "teacher");
                }
            } catch {
                document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = "...";
            }

        }


    }







    function handlerClick(e) {
        let swipes_set = localStorage.getItem("set_swipes");
        if (swipes_set == null) return;
        if (swipes_set == "false") return;

        if (['mousedown', 'touchstart'].includes(e.type)) {
            pointerStart = e.pageX;

        }
        if (['mouseup', 'touchend'].includes(e.type)) {
            if (pointerStart + 150 < e.pageX) {
                dnum -= 1;
                if (dnum < 0) {
                    dnum = 5;
                }
                document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").scrollTo(0, 0)
            }
            if (pointerStart - 150 > e.pageX) {
                dnum += 1;
                if (dnum > 5) {
                    dnum = 0
                }
                document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").scrollTo(0, 0)
            }

            selectors.forEach(o => {
                if (o.classList.contains('selected')) { o.classList.remove("selected") }
            })
            document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .daySelector .item[dnum='" + dnum + "']").classList.add("selected");
            let html = parseDay(shedule[0][dnum]);
            document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").innerHTML = html;
            updateLesson()
            try {
                if (localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "student") {
                    document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = shedule[0][dnum][0].date;
                } else {
                    document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = shedule[0][dnum][0].date + " | " + localStorage.getItem("profile" + localStorage.getItem("current_profile") + "teacher");
                }
            } catch {
                document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = "...";
            }
        }
    }



    function parseDay(data) {
        function generateBox(d) {
            let html = "";
            let types = "";
            let color = ""
            let subject = d.subject;
            if (d.subject.includes("(Лек)")) {
                types = "лекция";
                color = "#007AFF"
                subject = d.subject.replace("(Лек)", "")
            } else if (d.subject.includes("(Лаб)")) {
                types = "лабораторная работа";
                color = "#34C759"
                subject = d.subject.replace("(Лаб)", "")
            } else if (d.subject.includes("(ПЗ)")) {
                types = "практическое занятие";
                color = "#FFCC00";
                subject = d.subject.replace("(ПЗ)", "")
            } else {
                subject = d.subject;
                color = "#f0f0f0";
            }
            html += "<div class='shedule-box' id='shedule-[id]' hash='[hash]'>".replace("[hash]", d.hash).replace("[id]", d.id);
            html += "<div class='line' style='background: [color];'></div>".replace("[color]", color)
            html += "<div class='block'>"
            if (types != "") { html += "<div class='top' style='color: [color];'>[type]</div>".replace("[color]", color).replace("[type]", types) }
            html += "<div class='middle'>"

            html += "<div class='lesson'>"

            html += "<div class='name'>" + subject + "</div>"

            html += "<div class='classroom'>" + d.classroom + "</div>"
            if (d.is_combined && localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "student") {
                html += "<div class='combined'>"
                //html += "<span>Совместно:</span>"
                d.combined_main_groups.forEach(o => {
                    html += "<div class='group'>" + o + "</div>"
                })
                html += "</div>"
            } else if (localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "teacher") {
                html += "<div class='combined'>"
                //html += "<span>Группы:</span>"
                d.combined_with.forEach(o => {
                    html += "<div class='group'>" + o + "</div>"
                })
                html += "</div>"
            }

            html += "</div>"
            html += "<div class='time'>"
            html += "<div class='start'>" + d.time.replace("(", "").replace(")", "").split("-")[0] + "</div>"
            html += "<div class='end'>" + d.time.replace("(", "").replace(")", "").split("-")[1] + "</div>"
            html += "</div>"
            html += "</div>"
            if (d.teacher != "" && localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "student") {
                html += "<div class='bottom-box'>"
                html += "<div class='teacher-picture' style='width: 25px; height: 25px; background: [teacher-pick] no-repeat; background-size: cover; background-position: top; border-radius: 100%;'></div>"
                html += "<div class='teacher'>" + d.teacher + "</div>"
                html += "</div>"
            }
            html += "<div class='end_row'></div>"

            if (d.teacher_photo == null) {
                html = html.replace("[teacher-pick]", "url(./imgs/user.png)")
            } else {
                html = html.replace("[teacher-pick]", "url(" + d.teacher_photo + ")")
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
        if (localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "student") {
            let now = (await window.ScheduleAPI.getCurrentLesson(localStorage.getItem("profile" + localStorage.getItem("current_profile") + "faculty"), localStorage.getItem("profile" + localStorage.getItem("current_profile") + 'group')));
            window.now_lesson = now;
        }

        setTimeout(checkNowLesson, 10000);
    }

    function updateLesson() {

        let current_lesson_set = localStorage.getItem("set_current_lesson");

        function format_time(time) {
            let hours = Math.floor(time / 60 / 60)
            let minutes = Math.floor((time - hours * 60 * 60) / 60)
            let seconds = Math.floor(time - (minutes * 60) - (hours * 60 * 60))
            let st = ""
            if (hours > 0) {
                if (hours.toString().length == 1) {
                    st += "0"
                }
                st += hours + ":"
            }
            if (minutes.toString().length == 1) {
                st += "0"
            }
            st += minutes + ":"
            if (seconds.toString().length == 1) {
                st += "0"
            }
            st += seconds



            return st;
        }


        if (window.now_lesson && window.now_lesson.has_current_lesson) {
            let bls = document.querySelectorAll(".shedule-box");
            bls.forEach(e => {
                e.classList.remove("current")
            })
            try {

                let d = new Date;
                let current_timestamp = Math.floor(d.getTime() / 1000)

                if (current_lesson_set == null || current_lesson_set == "false") {

                } else {
                    document.querySelector(".shedule-box[hash='" + window.now_lesson.current_lesson.hash + "']").classList.add("current")
                    document.querySelector(".shedule-box[hash='" + window.now_lesson.current_lesson.hash + "'] .end_row").innerHTML = "Закончится через " + format_time(window.now_lesson.current_lesson_end_timestamp - current_timestamp)
                }


            } catch { }
        } else {
            let bls = document.querySelectorAll(".shedule-box");
            bls.forEach(e => {
                e.classList.remove("current")
            })
        }


        if (window.now_lesson && window.now_lesson.next_lesson) {
            //console.log(now_lesson.next_lesson)
            let bls = document.querySelectorAll(".shedule-box");
            bls.forEach(e => {
                e.classList.remove("next")
            })

            try {

                if (current_lesson_set == null || current_lesson_set == "false") {

                } else {
                    document.querySelector(".shedule-box[hash='" + window.now_lesson.next_lesson.hash + "']").classList.add("next")
                }



            } catch { }
        } else {
            let bls = document.querySelectorAll(".shedule-box");
            bls.forEach(e => {
                e.classList.remove("next")
            })
        }

    }


    async function getWeek() {
        let shedule
        if (localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "student") {
            shedule = (await window.ScheduleAPI.getWeek(localStorage.getItem("profile" + localStorage.getItem("current_profile") + "faculty"), localStorage.getItem("profile" + localStorage.getItem("current_profile") + 'group')));
        } else {
            shedule = {};
            shedule.schedule = (await window.ScheduleAPI.getTeacherSchedule(localStorage.getItem("profile" + localStorage.getItem("current_profile") + "teacher")))
            //console.log(shedule)
        }
        //console.log(shedule)
        let days1 = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
        let days = [[], [], [], [], [], []];
        let today = [];
        let lastD = new Date();
        let last = "";
        let month = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
        last += lastD.getDate() + " ";
        last += month[lastD.getMonth()] + " ";
        last += lastD.getFullYear() + " г."
        let dnum = -1
        shedule.schedule.forEach(e => {
            days[days1.indexOf(e.day)].push(e);
            if (e.date == last) {
                today.push(e);
                dnum = days1.indexOf(e.day)
            }
        })

        if (dnum == -1) {
            let cou = -1;
            days.forEach(e => {
                cou += 1;
                if (e.length != 0 && dnum == -1) {
                    dnum = cou;
                }
            })
        }

        return [days, dnum];
    }

    let is_admin = (await window.ScheduleAPI.checkAdmin()).is_admin;

    await checkNowLesson();
    setInterval(updateLesson, 100)

    let shedule = await getWeek();

    let dnum = shedule[1]
    let today = shedule[0][dnum];

    document.querySelector("*[action='goto-settings']").addEventListener("click", () => {
        showScreen("settings")
    })
    document.querySelector("*[action='goto-tg']").addEventListener("click", () => {
        window.Telegram.WebApp.openTelegramLink("https://t.me/vsu_shedule");
    })

    if (is_admin) {
        document.querySelector("*[action='goto-admin']").addEventListener("click", () => {
            showScreen("admin")
        })
        document.querySelector("*[action='goto-admin']").classList.remove("hidden")
        document.querySelector(".screen[screen-id='admin'] .header .backButton").addEventListener("click", () => {
            showScreen("homeboard")
        })
    }
    document.querySelector("*[action='goto-help']").addEventListener("click", () => {
        window.Telegram.WebApp.openTelegramLink("https://t.me/m/QDBiIh9BYWFi");
    })

    window.is_admin = is_admin;

    await init2_1();

    if (['android'].includes(window.Telegram.WebApp.platform)) {
        home.addEventListener("touchstart", handleAn)
        home.addEventListener("mousedown", handlerClick)
        home.addEventListener("touchend", handleAn)
        home.addEventListener("touchmove", handleAn)
        home.addEventListener("mouseup", handleAn)
    } else {
        home.addEventListener("touchstart", handlerClick)
        home.addEventListener("mousedown", handlerClick)
        home.addEventListener("touchend", handlerClick)
        home.addEventListener("mouseup", handlerClick)
    }

    if (dnum != -1) {
        let html = parseDay(today);

        let selectors = document.querySelectorAll(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .daySelector .item");

        document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").innerHTML = html;
        updateLesson()

        //console.log(shedule)

        if (localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "student") {
            document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = shedule[0][dnum][0].date;
        } else {
            document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = shedule[0][dnum][0].date + " | " + localStorage.getItem("profile" + localStorage.getItem("current_profile") + "teacher");
        }

        document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] *[dnum='{dnum}']".replace("{dnum}", dnum)).classList.add("selected");
        document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").scrollTo(0, 0)

        selectors.forEach(e => {
            e.addEventListener("click", () => {

                selectors.forEach(o => {
                    if (o.classList.contains('selected')) { o.classList.remove("selected") }
                })
                e.classList.add("selected");
                dnum = Number(e.getAttribute('dnum'))
                let html = parseDay(shedule[0][dnum]);
                document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").innerHTML = html;
                updateLesson()
                document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").scrollTo(0, 0)
                try {
                    if (localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "student") {
                        document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = shedule[0][dnum][0].date;
                    } else {
                        document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = shedule[0][dnum][0].date + " | " + localStorage.getItem("profile" + localStorage.getItem("current_profile") + "teacher");
                    }
                } catch {
                    document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = "...";
                }
            })
        })



    } else {
        // нет расписания

        document.querySelector(".screen[screen-id='homeboard'] .daySelector").style.display = 'none'
        let lastD = new Date();
        let last = "";
        let month = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
        last += lastD.getDate() + " ";
        last += month[lastD.getMonth()] + " ";
        last += lastD.getFullYear() + " г."

        document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .subtitle").innerHTML = last

        let html = "<div class='shedule-box'>";
        html += "<div class='line' style='background: [color];'></div>".replace("[color]", "rgba(255, 56, 60, 1)")


        html += "<div class='block'>"

        let types = ""
        let fac = {
            "Математики и информационных технологий": "ФМиИТ",
            "Педагогический": "ПФ",
            "Юридический": "ЮФ",
            "Гуманитарного знания и коммуникаций": "ФГЗиК",
            "Социальной педагогики и психологии": "ФСПиП",
            "Физической культуры и спорта": "ФФКиС",
            "Химико-биологических и географических наук": "ФХБиГН",
            "Художественно-графический": "ХГФ"
        }
        if (localStorage.getItem("profile" + localStorage.getItem("current_profile") + "mode") == "student") {
            types = fac[localStorage.getItem("profile" + localStorage.getItem("current_profile") + "faculty")] + " | " + localStorage.getItem("profile" + localStorage.getItem("current_profile") + "group")
        } else {
            types = localStorage.getItem("profile" + localStorage.getItem("current_profile") + "teacher")
        }

        html += "<div class='middle'>"
        html += "<div class='lesson'>"
        html += "<div class='top' style='color: [color];'>[type]</div>".replace("[color]", "rgba(255, 56, 60, 1)").replace("[type]", types)
        html += "<div class='name'>В базе данных нет пар!</div>"

        html += "<div class='classroom'>Попробуйте зайти в расписание позже</div>"
        html += "</div>"
        html += "</div>"




        html += "</div>"

        document.querySelector(".screen[screen-id='homeboard'] .screen-part[part-id='home'] .sheduleBlock").innerHTML = html;
    }



}