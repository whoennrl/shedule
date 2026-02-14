window.addEventListener("DOMContentLoaded", () => {

    let selects = document.querySelectorAll("select");

    selects.forEach(select => {
        const observer = new MutationObserver(() => {
            const event = new CustomEvent('selectStructureChanged', {
                detail: {
                    select: select,
                    optionsCount: select.options.length,
                    timestamp: Date.now()
                },
                bubbles: true
            });

            select.dispatchEvent(event);
        });

        observer.observe(select, {
            childList: true,
            subtree: true
        });
    });

    selects.forEach(e => {

        let select = e;

        let selectBox = document.createElement("div")
        selectBox.classList.add("select-box");
        selectBox.setAttribute("select-id", select.id);

        let selectInfo = document.createElement("div");
        selectInfo.classList.add("select-info");
        selectInfo.setAttribute("select-id", select.id);
        selectInfo.innerHTML = "<span>" + select.querySelector("option[value='" + select.value +"']").textContent + "</span>"
        selectInfo.addEventListener("click", ()=>{
            selectBox.classList.add('opened');
        })
        

        select.style.display = 'none'

        select.addEventListener("selectStructureChanged", (e) => {
            updateOptions(e.target)
        })

        select.insertAdjacentElement('afterend', selectBox)
        select.insertAdjacentElement("afterend", selectInfo)
        updateOptions(select)

    })

})

function updateOptions(el) {
    //console.log(el.id)
    let options = el.querySelectorAll("option");
    let selectBox = document.querySelector(".select-box[select-id='" + el.id + "']");
    selectBox.innerHTML = "";
    options.forEach(o => {
        let option = document.createElement("div");
        option.classList.add("select-option");
        option.innerHTML = o.innerHTML;
        if (o.disabled) {
            option.classList.add("disabled");
        }
        if (o.selected) {
            option.classList.add("selected");
        }

        option.setAttribute("value", o.value);

        option.addEventListener("click", (e) => {
            selectBox.classList.remove("opened")
            if (!e.target.classList.contains('disabled')) {
                //console.log(e);
                el.value = e.target.getAttribute("value");
                let alls = e.target.parentElement.querySelectorAll(".select-option");
                alls.forEach(i => {
                    i.classList.remove("selected")
                })
                e.target.classList.add("selected")

                let selectInfo = document.querySelector(".select-info[select-id='" + el.id + "']")
                selectInfo.innerHTML = "<span>" + el.querySelector("option[value='" + el.value +"']").textContent + "</span>"
            }
        })

        selectBox.appendChild(option)
    })
}