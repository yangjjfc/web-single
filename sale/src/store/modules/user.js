
const user = {
    state: {
        userInfo: {
            avator: '',
            userName: ''
        }
    },
    mutations: {
        // 用户登入
        CHANGEUSER (state, data) {
            state.userInfo = Object.assign({}, state.userInfo, data);
            // console.log(data);
            changeEnvironment({
                TOKEN: data.token
            });
            sessionStorage.setItem('user', JSON.stringify(state.userInfo));
        },
        // 用户刷新,重新赋值
        REFRESH (state, data) {
            let user = JSON.parse(sessionStorage.getItem('user'));
            state.userInfo = user || null;
        },
       
    },
    actions: {
        // 登录
        login (context, data) {
            return new Promise((resolve, reject) => {
                Http('login', data).then(
                    result => {
                        let userinfo = result || {};
                        if (userinfo.data) {
                            context.commit('CHANGEUSER', userinfo.data);
                            resolve(userinfo);
                        } else {
                            reject(userinfo);
                        }
                    },
                    err => {
                        reject(err);
                    }
                );
            });
        },
        
        // 当前用户信息
        currentUser ({ commit, state }, refresh = false) {
            return new Promise((resolve, reject) => {
                state.userInfo && state.userInfo.enterpriseNo && !refresh
                    ? resolve(state.userInfo) // 判断是否需要去请求
                    : Http('currentUser', {
                        token: state.userInfo ? state.userInfo.token : ''
                    }).then(
                        result => {
                        // 获取token 获取登录信息
                            let user = result.data || {};
                            commit('CHANGEUSER', user);
                            resolve(user);
                        },
                        err => {
                            reject(err);
                        }
                    );
            });
        }
    }
};

export default user;
