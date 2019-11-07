import { registerApplication, start } from 'single-spa';
import { match } from './utils/global';
import permission from './store/app';
window.SystemJS = window.System; //阻止webpack解析


Promise.all([SystemJS.import('vue'),SystemJS.import('/project.js')]).then(function (modules) {
    var Vue = modules[0];
    var projects = modules[1].projects;
    console.log("TCL: projects", projects)
    window.EventBus = new Vue();
    EventBus.$on('getRouter', (data) => {
        EventBus.addRoute = data;
    });
    for (let obj of projects) {
        registerApplication(obj.name, () => SystemJS.import(obj.name), () => {
            if (obj.base) {
                return true
            } else {
                let res = match(window.location.pathname, obj.path)
                return res && res.length
            }
        }, {
            store: permission
        })
    }
    start();
});
