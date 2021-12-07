const RequestOfferingCard = Vue.component('requestoffering',{
    props:{
        img: {required: true, type: String},
        title: {required: true, type: String},
        text: {required: true, type: String},
        btn_type: {required: true, type: String}
    },
    template: `
        <div class='card'>
            <img src='{{ img }}' class='card-img-top' alt='{{ title }}'>
            <div class='card-body-container'>
                <div class='card-body'>
                    <h5 class='card-title'>{{ title }}</h5>
                    <p class='card-text'>{{ text }}</p>
                    <a href="#" class='btn btn-primary'>{{ btn_type == 'aro' ? 'Start request':'Start reading' }}</a>
                </div>
            </div>
        </div>
    `
});

async function get_data() {
    return await new Promise((resolve,reject)=>{fetch("./RequestOfferings.json").then((r)=>{
        resolve(r.json());
       })});
}

const app = new Vue({
    el:'#outlook',
    async data() {
        return {requestOfferings: get_data()}
    }
});
