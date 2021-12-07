function create_aro_card(obj) {
    return `
    <div class='card'>
            <img src='${obj.img}' class='card-img-top' alt='${obj.title}'>
            <div class='card-body-container'>
                <div class='card-body'>
                    <h5 class='card-title'>${obj.title}</h5>
                    <p class='card-text'>${obj.text}</p>
                    <a href="#" class='btn btn-primary'>${ obj.type == 'aro' ? 'Start request':'Start reading' }</a>
                </div>
            </div>
        </div>
    `;
}

function create_aro_group(obj) {
    var r = `<div class='card-group'>`;
    obj.forEach((aro)=>{
        r += create_aro_card(aro);
    });
    r += `</div>`;
    return r;
}

fetch("./RequestOfferings.json").then((r)=>{
    r.json().then((pages)=>{
        Object.keys(pages).forEach((page)=>{
            $(`#${page}`).append(create_aro_group(pages[page]));
        });
    });
});

