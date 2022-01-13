function switch_page(name) {
    var pages = ['0','1','2','3','4','5','6'];
    pages.forEach((page)=>{
        $(`div[name='${page}']`).css('display', 'none');
    });
    $(`div[name='${name}']`).css('display', 'block');
}

function build_aro(aro_obj) {
    return `<div class="ark-sm-3">
    <div class="my-card">
      <div class="my-card-body">
        <img src="${aro_obj.img}" alt="${aro_obj.title}">
        <div class="my-card-text">
          <h5 class="card-title">${aro_obj.title}</h5>
          <div class="my-card-text-body">
            ${aro_obj.text}
          </div>
        </div>
        <div style='margin-top:auto'>
            <a href='#' class="btn btn-primary aro-btn">${ aro_obj.type == 'aro' ? 'Start request':'Start reading' }</a>
        </div>
      </div>
    </div>
  </div> `;
}

function build_aro_group(group_obj) {
    var r = `<div class='my-flex'>`;
    group_obj.forEach((aro_obj)=>{
        r += build_aro(aro_obj);
    });
    r += `</div>`
    return r;
}

fetch("./RequestOfferings.json").then((r)=>{
    r.json().then((pages)=>{
        Object.keys(pages).forEach((page)=>{
            $(`#${page}`).append(build_aro_group(pages[page]));
        });
    });
});

$('#help').on('change', (e)=>{
    switch_page($('#help').val());
});