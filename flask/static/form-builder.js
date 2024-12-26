$(document).ready(function(){
    $('#phone-t').mask('+7(000) 000 0000')
})
let groups_json
fetch("/static/groups.json") 
    .then(response => response.json()) 
    .then(json => add_services(json.groups))

function add_services(groups) {
    groups = add_ids(groups)
    groups_json = groups
    const parent = document.getElementById("group-container")
    for (const group of groups) {
        const group_container = document.createElement("div")
        group_container.setAttribute("class", "mb-3")
        group_container.setAttribute("id", `g${group.id}`)
        parent.appendChild(group_container)

        group_container.appendChild(
            build_HTML_group_checkbox(group)
        )
        group_container.appendChild(
            build_HTML_group_description(group)
        )
        group_container.appendChild(
            build_HTML_group_collapse(group)
        )
        const subgroup_container = document.getElementById(`g${group.id}s`)
        for (const item of group.items) {
            const service = build_HTML_service(item)
            subgroup_container.appendChild(service)
        }
    }
    $('.service-checkbox').click(function(e) {
        handle_service_checkbox(e)
    })
    $("textarea").change(function(e) {
        handle_required_fields(e)
    })
    $("#name-t").change(function(e) {
        handle_required_fields(e)
    })
    $("#phone-t").change(function(e) {
        handle_required_fields(e)
    })
    $("#privacy-popup").change(function(e) {
        handle_required_fields(e)
    })
    build_thank_you_page(order_obj, groups_json)
}

function add_ids(groups) {
    for (let g = 0; g < groups.length; g++) {
        groups[g].id = g
        for (let s = 0; s < groups[g].items.length; s++) {
            groups[g].items[s].s = s
            groups[g].items[s].g = g
        }
    }
    return groups
}

function build_HTML_group_checkbox(group) {
    const group_checkbox = document.createElement('div')
    group_checkbox.innerHTML = `
        <input data-toggle="collapse" href="#g${group.id}c" role="button" aria-expanded="false" aria-controls="g${group.id}c" class="form-check-input group-checkbox" type="checkbox" id="g${group.id}ch" name="g${group.id}">
        <label class="form-check-label plus-minus" id="g${group.id}l" for="g${group.id}ch"></label>   
        <label style="font-size: 18px; margin-left: 4px; margin-bottom: 0px;" for="g${group.id}ch">${group.name}</label>
    `
    group_checkbox.setAttribute("class", "form-check plus-minus-group")
    group_checkbox.setAttribute("style", "")
    return group_checkbox
}

function build_HTML_group_description(group) {
    const group_description = document.createElement('div')
    group_description.innerHTML = `
        <small style="margin-top: 0em;" class="form-text text-muted">${group.description}</small>
    `
    return group_description
}

function build_HTML_group_collapse(group) {
    const group_collapse = document.createElement('div')
    group_collapse.innerHTML = `
        <div class="collapse" id="g${group.id}c">
            <div class="form-group" id="g${group.id}s"></div>
        </div>
    `
    group_collapse.setAttribute("class", "ml-3")
    return group_collapse
}

function build_HTML_service(item) {
    const service = document.createElement('div')
    service.innerHTML = `
        <div class="form-check mt-3">
            <table width="100%">
                <tr>
                    <th width="85%" style="font-weight: normal;">
                        <input data-toggle="collapse" role="button" aria-expanded="false" class="form-check-input service-checkbox substituted" type="checkbox" href="#g${item.g}s${item.s}c" aria-controls="g${item.g}s${item.s}c" id="g${item.g}s${item.s}" name="g${item.g}s${item.s}">
                        <label style="font-size: 15px;" class="form-check-label" for="g${item.g}s${item.s}">${item.name}</label>
                    </th>
                    <th width="15%" class="text-right">
                        <span class="badge badge-secondary">${item.price}</span>
                    </th>
                </tr>
            </table>
        </div>
        <small style="margin-top: 0em;" class="form-text text-muted">${item.description}</small>
        <div class="was-validated collapse mt-1" id="g${item.g}s${item.s}c">
            <textarea placeholder="${item.tip}" class="form-control is-invalid"  id="g${item.g}s${item.s}t" rows="3" name="g${item.g}s${item.s}t"></textarea>
        </div>
    `
    service.setAttribute("id", `g${item.g}s${item.s}e`)
    return service
}

// TODO Remove total
function build_thank_you_page(order_obj, groups_json) {
    if (order_obj.main) { return }
    document.getElementById("order-id").innerText = order_obj.order_id

    const order_table = document.getElementById("service-table-th")
    for(let order of order_obj.order) {
        const tr = document.createElement("tr")
        const group = groups_json[Number(order[1][1])]
        let group_name = group.name
        let title = group.items[order[1][3]].name
        if (group_name == "🤷‍♂️ Помощь в постановке задачи") {
            group_name = ""
            title = "🤷‍♂️ Помощь в постановке задачи"
        }
        tr.innerHTML = `
            <th>
            ${title}
            <small class="form-text text-muted">${group_name}</small>
            </th>
        `
        order_table.appendChild(tr)
    }

    const consult_table = document.getElementById("consult-table-th")
    const tr = document.createElement("tr")
    tr.innerHTML = `
    <th width="80%">
    Первичный (вводный) звонок перед началом работ
    </th>
    <th width="20%"><span class="badge badge-secondary"><Бесплатно></span></th>
    `
    consult_table.appendChild(tr)
}