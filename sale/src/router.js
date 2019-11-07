import Router from 'vue-router'
const myRouter = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...(EventBus.addRoute || [])
  ]
});
if(!EventBus.addRoute){
  EventBus.$on('getRouter', target => {
    myRouter.addRoutes(target);
  });  
}
export default myRouter;
