document.addEventListener("DOMContentLoaded", ()=>{

    let mode = localStorage.getItem("install-step");
    console.log(mode)
    if (mode != null && mode == "installed") {

        let bl = document.querySelectorAll(".promobox");
        bl.forEach(e=>{
            let prID = e.getAttribute("promoid");
            let showed = localStorage.getItem("promo-" + prID);
            if (showed == null || showed == "false") {
                e.classList.remove("hidden")
            }
            e.querySelector(".button").addEventListener("click", ()=>{
                localStorage.setItem("promo-" + prID, "true")
                e.classList.add("hidden")
            })
        })

    }

})