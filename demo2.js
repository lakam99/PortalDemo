const pages = ['0','1','2','3','4','5','6'];
var item_count = 0;
const icons = {
              maintenance: {src:'./assets/maintenance.png', alt:'maintenance', type: 2},
              issue: {src:'./assets/warn.png', alt:'issue', type: 1},
              resolved: {src:'./assets/complete.png', alt:'resolved', type: 3}
              };

var local_updates = undefined;
var edit_mode = false;
var indexes = [];

function hide_pages() {
  pages.forEach((page)=>{
    $(`div[name='${page}']`).css('display', 'none');
});
}

function switch_page(name) {
  hide_pages();
    $(`div[name='${name}']`).css('display', 'block');
}

function build_aro(aro_obj) {
  return `
  <div class="ark-sm-3">
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

function get_indexes() {
  indexes = $(".accordion:not(#item-x)").toArray().map((e)=>{return parseInt($(e).attr('id').replace('item-',''))});
}

function build_update(update_obj) {
  item_count++;
  let icon = icons[update_obj.type];
  update_obj.timestamp === undefined ? new Date().toDateString():update_obj.timestamp;
  return `
  <div class="col-sm-4">
    <div class="accordion" id='item-${item_count}'>
      <div class="accordion-item">
        <h2 class="accordion-header" id='item${item_count}-h'>
          <button class="accordion-button type-${icon.type}" type="button" data-bs-toggle="collapse" data-bs-target="#item${item_count}-b" data-bs-parent="#item${item_count}">
            <img class="update-icon" src="${icon.src}" alt='${icon.alt}'>
            ${update_obj.title}
          </button>
        </h2>
        <div id="item${item_count}-b" class="accordion-collapse collapse show" data-bs-parent="#item${item_count}">
          <div class="accordion-body">
              <p>${update_obj.text}</p>
              <p class="timestamp"> Posted ${update_obj.timestamp} </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function build_modify_update(update_obj) {
  item_count++;
  let icon = icons[update_obj.type];
  update_obj.timestamp === undefined ? new Date().toDateString():update_obj.timestamp;
  return `
  <div class="col-sm-4">
    <div class="accordion" id='item-${item_count}'>
      <div class="accordion-item">
        <h2 class="accordion-header" id='item${item_count}-h'>
          <div class="accordion-button type-${icon.type}">
            <img class="update-icon" src="${icon.src}" alt='${icon.alt}'>
            <input type='text' class='form-control modify-title' value="${update_obj.title}" id='modify-title-${item_count}'/>
          </div>
        </h2>
        <div id="item${item_count}-b" class="accordion-collapse collapse show" data-bs-parent="#item${item_count}">
          <div class="accordion-body">
              <textarea class='form-control' id='modify-text-${item_count}'>${update_obj.text}</textarea>
              <p class="timestamp"> Posted ${update_obj.timestamp} </p>
              <div class='float-right garbage'></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function build_aro_group(group_obj) {
    var r = `<div class='my-flex'>`;
    group_obj.forEach((aro_obj)=>{
        r += build_aro(aro_obj);
    });
    r += `</div>`
    return r;
}

function build_existing_updates(updates) {
  $('#updates').html('');
  item_count = 0;
  updates.forEach((update)=>{
    $('#updates').append(build_update(update));
  })
  get_indexes();
}

function build_modify_updates() {
  item_count = 0;
  $('#updates').html('');
  local_updates.forEach((update)=>{
    $('#updates').append(build_modify_update(update));
  });
  $('#updates').append(`
  <div class="col-sm-4">
    <div class="accordion" id='item-x'>
      <div class="accordion-item">
        <h2 class="accordion-header" id='itemx-h'>
            <p class='display-6 text-center'>New Update</p>
        </h2>
        <div id="itemx-b" class="accordion-collapse collapse show" data-bs-parent="#itemx">
          <div class="accordion-body text-center">
              &nbsp;
          </div>
        </div>
      </div>
    </div>
  </div>
  `);
  get_indexes();
}

fetch("./RequestOfferings.json").then((r)=>{
    r.json().then((pages)=>{
        Object.keys(pages).forEach((page)=>{
            $(`#${page}`).append(build_aro_group(pages[page]));
        });
    });
});

fetch("./updates.json").then((r)=>{
  r.json().then((response)=>{
    local_updates = response.updates;
    build_existing_updates(local_updates);
    get_indexes();
  })
})

$('#help').on('change', (e)=>{
    switch_page($('#help').val());
});

function save_updates() {
  get_indexes();
  var new_updates = [];
  indexes.forEach((i)=>{
    new_updates.push({
      type: $(`#item${i}-h > div > img`).attr('alt'),
      title: $(`#modify-title-${i}`).val(),
      text: $(`#modify-text-${i}`).val(),
      timestamp: $(`#item-${i} > .accordion-item > div > div > .timestamp`).text().replace('Posted ','').substring(1) || new Date().toDateString()
    });
  });
  local_updates = new_updates;
}

function toggle_edit_mode() {
  edit_mode = !edit_mode;
  if (edit_mode) {
    $('#cancel-btn').removeClass('disabled');
    $('#save-btn').removeClass('disabled');
    $('#cancel-btn').on('click', (e)=>{
      build_existing_updates(local_updates);
      toggle_edit_mode();
    });
    $('#save-btn').on('click', async (e)=>{
      $('#save-btn').off('click');
      save_updates();
      build_existing_updates(local_updates);
      await delay(500);
      toggle_edit_mode();
    });
  } else {
    $('#cancel-btn').addClass('disabled');
    $('#save-btn').addClass('disabled');
  }
}

$('#edit-btn').on('click', (e)=>{
  if (!edit_mode) {
    toggle_edit_mode();
  }
  item_count = 0;
  build_modify_updates();
  hook_update_icons();
  $('#item-x').on('click', (e)=>{
    let icon = icons.issue;
    let timestamp = new Date().toDateString();
    item_count++;
    $('#item-x').parent().before(
      `
  <div class="col-sm-4">
    <div class="accordion" id='item-${item_count}'>
      <div class="accordion-item">
        <h2 class="accordion-header" id='item${item_count}-h'>
          <div class="accordion-button type-1">
            <img class="update-icon" src="${icon.src}" alt='${icon.alt}'>
            <input type='text' class='form-control modify-title' value="" id='modify-title-${item_count}'/>
          </div>
        </h2>
        <div id="item${item_count}-b" class="accordion-collapse collapse show" data-bs-parent="#item${item_count}">
          <div class="accordion-body">
              <textarea class='form-control' id='modify-text-${item_count}'></textarea>
              <p class="timestamp"> Posted ${timestamp} </p>
              <div class='float-right garbage'></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
    );
    hook_update_icons();
  });
});

const delay = millis => new Promise((resolve, reject) => {
  setTimeout(_ => resolve(), millis)
});

function get_next_img(current) {
  let imgs = ['./assets/warn.png', './assets/maintenance.png', './assets/complete.png'];
  let types = ['type-1', 'type-2', 'type-3'];
  let alts = ['issue','maintenance', 'resolved'];
  let i = imgs.indexOf(current);
  if (i+1 > imgs.length - 1) {
    i = 0;
  } else {
    i++;
  }
  return {img: imgs[i], type:types[i], alt:alts[i]};
}

function hook_update_icons() {
  $('.update-icon:not(#edit-btn)').toArray().forEach((i)=>{
    $(i).on('click', async (e)=>{
      let current = $(e.currentTarget).attr('src');
      let next = get_next_img(current);
      $(e.currentTarget).attr('src', next.img);
      $(e.currentTarget).attr('alt', next.alt);
      $(e.currentTarget).parent().removeClass('type-1').removeClass('type-2').removeClass('type-3').addClass(next.type);
      await delay(500)
    });
  });
  hook_garbage_cans();
}

function hook_garbage_cans() {
  $('.garbage').toArray().forEach((i)=>{
    $(i).on('click', async (e)=>{
      let parent = $(e.currentTarget).parent().parent().parent().parent();
      let index = $('.accordion').toArray().indexOf(parent[0]);
      if (index != -1) {
        local_updates.splice(index, 1);
        indexes.splice(index, 1);
      }
      $()
      parent.parent().remove();
      await delay(500);
    });
  });
}


switch_page('0');