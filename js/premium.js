/*
 * Стоимость подписки: 50 звезд / месяц
 * Премиум фишки:
 * 1. Автоматическое напоминание о парах
 * 2. Просмотр занятости аудиторий
 * 3. Просмотр расписания преподавателя
 * 4. Просмотр текущей пары (отображение в расписании, когда закончится и т.п.) 
 */

document.addEventListener("DOMContentLoaded", ()=>{

    // инициализация блока premium

    document.querySelector("*[screen-id='homeboard'] *[part-id='menu'] *[action='goto-premium']").addEventListener("click", ()=>{
        showScreen("premium")
    })
    document.querySelector("*[screen-id='premium'] .backButton").addEventListener("click", ()=>{
        showScreen("homeboard")
    })

})