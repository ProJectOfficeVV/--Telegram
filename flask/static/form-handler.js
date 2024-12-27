const service_alert_text = "Пожалуйста выберите хотя бы одну услугу и заполните описание к ней"
const personal_alert_text = "Пожалуйста заполните поля с именем и номером телефона"
const privacy_alert_text =  "Пожалуйста ознакомьтесь с условиями обработки данных и нажмите галочку напротив"

async function handle_service_checkbox(e) {
    await freeze_group_on_select(e.target.id[1])
    await set_required_on_select()
    await sleep(10)
    document.getElementById(e.target.id).disabled = true
    await sleep(400)
    document.getElementById(e.target.id).disabled = false
}
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
function freeze_group_on_select(group_id) {
    const checks = $.map($(`#g${group_id}c > div > div > .form-check > input`), input => input.checked)
    if (checks.includes(true)) {
        document.getElementById(`g${group_id}ch`).parentNode.setAttribute("onclick", "return false")
        document.getElementById(`g${group_id}ch`).setAttribute("data-toggle", "")
    } else {
        document.getElementById(`g${group_id}ch`).parentNode.setAttribute("onclick", "")
        document.getElementById(`g${group_id}ch`).setAttribute("data-toggle", "collapse")
    }
}

function set_required_on_select() {
    const services = document.getElementsByClassName("service-checkbox")
    Array.from(services).forEach((s) => {
        const textarea = document.getElementById(`${s.id}t`)
        if (s.checked) {
            textarea.required = true
        } else {
            textarea.required = false
        }
       
    })
}

function handle_required_fields(e) {
    const alert = document.getElementById("btn-alert").innerText
    if (
        e.target.id == "privacy-popup" && 
        alert == privacy_alert_text && 
        document.getElementById("privacy-popup").checked
    ) {
        button_alert("")
    } else if (
        e.target.id.includes("-") && 
        alert == personal_alert_text && 
        document.getElementById("name-t").value != "" &&
        document.getElementById("phone-t").value != ""
    ) {
        button_alert("")
    } else if (
        e.target.id.includes("g") && 
        alert == service_alert_text && 
        check_filled_fields()
    ) {
        button_alert("")
    }
}


function handle_submit() {
    const selected_services = parse_selected_services()
    button_alert("")
    clear_check_table()
    add_check_consults(selected_services)
    add_check_services(selected_services) 

    if (check_filled_fields() && check_personal_fields() && check_privacy_checkbox() && check_ads()) {
        $("#form").submit()
    } else if (document.getElementById("btn-alert").innerText == "") {
        window.scrollTo(0,0)
    }
}
function check_ads() {
    if (document.getElementById("ads-popup").checked) {
        document.getElementById("accept-ads").value = true
    } else {
        document.getElementById("accept-ads").value = false
    }
    return true
}
function check_privacy_checkbox() {
    if (document.getElementById("privacy-popup").checked) {
        return true
    } else {
        button_alert(privacy_alert_text)
    }
}

function button_alert(alert) {
    document.getElementById("btn-alert").innerText = alert
}

function check_filled_fields() {
    let checked = false
    let filled = true
    Array.from(document.getElementsByClassName("service-checkbox")).forEach((s) => {
        if (s.checked) {
            if (document.getElementById(`${s.id}t`).value == "") { filled = false } 
            if (checked == false) { checked = true }
        }
    })
    if (!(checked && filled)) {
        button_alert(service_alert_text)
    } 
    return checked && filled
}

function check_personal_fields() {
    const personal = document.getElementById("personal-container")
    if (personal.hidden) {
        personal.hidden = false
        document.getElementById("group-container").hidden = true
        document.getElementById("back-btn").hidden = false
    } else if (check_filled_personal_fields()){
        return true
    }
}

function check_filled_personal_fields() {
    if (
        document.getElementById("name-t").value != "" &&
        document.getElementById("phone-t").value.length == 16
    ) { return true }
    button_alert(personal_alert_text)
    return false
}

function back_btn() {
    window.scrollTo(0,0)
    document.getElementById("form-container").hidden = false
    document.getElementById("personal-container").hidden = true
    document.getElementById("group-container").hidden = false
    document.getElementById("back-btn").hidden = true
    document.getElementById("thank-you-container").hidden = true
}

function add_check_services(services) {
    const table = document.getElementById("service-table")
    for (const service of services) {
        service.symbol = groups_json[service.group].symbol
        const tr = document.createElement("tr")
        const service_name = service.symbol == "🤷‍♂️" ? "Помощь в постановке задачи" : service.name
        tr.innerHTML = `
            <th>
                ${service.symbol} ${service_name}
                <small id="personal-name-help" class="form-text text-muted mb-2">${service.info}</small>
            </th>
        `
        table.appendChild(tr)
    }
}
// TODO Remove total
function add_check_consults(services) {
    const table = document.getElementById("consult-table")
    let groups = []
    let total = 0
    for (const service of services) {
        if (!groups.includes(service.group)) {
            groups.push(service.group)
        }
    }

    const tr = document.createElement("tr")
    tr.innerHTML = `
        <th width="80%">
        Первичный (вводный) звонок перед началом работ
        </th>
        <th width="20%"><span class="badge badge-secondary">Бесплатно</span></th>
    `
    table.appendChild(tr)
}

function parse_selected_services() {
    let selected_services = []
    Array.from(document.getElementsByClassName("service-checkbox")).forEach((s) => {
        if (s.checked && document.getElementById(`${s.id}t`).value != "") {
            selected_services.push(
                build_selected_service_object(s)
            )
        }
    })
    return selected_services
}

function build_selected_service_object(service) {
    let item_id = service.id.length() == 5 ? `${service.id[3]}${service.id[4]}` : service.id[3]
    const item = groups_json[service.id[1]].items[item_id]
    return {
        group: service.id[1],
        name: item.name,
        info: document.getElementById(`${service.id}t`).value,
        price: item.price
    }
}

function clear_check_table() {
    document.getElementById("service-table").innerHTML = ""
    document.getElementById("consult-table").innerHTML = ""
}
