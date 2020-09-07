const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  router_list: state => state.user.router_list,
  auth_list: state => state.user.auth_list,
}
export default getters
