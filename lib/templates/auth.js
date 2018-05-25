export const store = {
  state: {
    publicPages: []
  },
  getters: {
    // getters
  },
  mutations: {
    // mutations
  },
  actions: {
    onInitAuth ({ dispatch }, payload) {
      dispatch('authenticate')
        .then((result) => {
          // handle success like a boss
        })
        .catch((error) => {
          // handle error like a boss
        })
    }
  }
}
