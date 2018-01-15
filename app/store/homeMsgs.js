import { getFastSubjects } from '~/api/subject'

export const state = () => ({
  activeFixedSubjects: [],
  hotSubjects: [],
  activeHotSubjects: null,
  hasExplain: false,
  pushSettingsOpen: false,
  push: {
    notification: true,
    audio: true,
    tts: true
  }
})

export const getters = {
  msgsParams (state) {
    const { activeHotSubjects, hasExplain, activeFixedSubjects } = state
    if (activeHotSubjects) {
      return {
        subjids: activeHotSubjects,
        isHotSubject: true
      }
    } else if (activeFixedSubjects.length) {
      return {
        subjids: activeFixedSubjects.join(','),
        hasExplain: hasExplain ? true : undefined
      }
    } else {
      return {
        subjids: '9,10,723,35,469',
        hasExplain: hasExplain ? true : undefined
      }
    }
  }
}

export const mutations = {
  setSettingsStatus (state, status) {
    state.pushSettingsOpen = status
  },
  setPush (state, payload) {
    const push = {
      ...state.push,
      [payload.type]: payload.value
    }
    state.push = push
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('PUSH', JSON.stringify(push))
    }
  },
  initPush (state) {
    const push = JSON.parse(window.localStorage.getItem('PUSH') || null)
    if (push) {
      state.push = push
    }
  },
  selectFixedSubject (state, payload) {
    // 选中状态为 true or false
    if (!payload.value) {
      state.activeFixedSubjects = state.activeFixedSubjects.filter(id => id !== payload.id)
    } else {
      state.activeFixedSubjects = [...state.activeFixedSubjects, payload.id]
    }
    state.activeHotSubjects = null
  },
  toggleExplain (state) {
    state.hasExplain = !state.hasExplain
  },
  saveHotSubjects (state, data) {
    state.hotSubjects = data
  },
  setActiveHotSubject (state, id) {
    state.activeHotSubjects = id
    state.activeFixedSubjects = []
    state.hasExplain = false
  }
}

export const actions = {
  setSettingsStatus ({ commit }, status) {
    commit('setSettingsStatus', status)
  },
  setPush ({ commit }, payload) {
    commit('setPush', payload)
  },
  initPush ({ commit }, payload) {
    commit('initPush')
  },
  selectFixedSubject ({ commit }, payload) {
    commit('selectFixedSubject', payload)
  },
  toggleExplain ({ commit }) {
    commit('toggleExplain')
  },
  getHotSubjects ({ commit }) {
    return new Promise((resolve, reject) => {
      getFastSubjects().then((res) => {
        commit('saveHotSubjects', res)
      })
    })
  },
  setActiveHotSubject ({ commit }, id) {
    commit('setActiveHotSubject', id)
  }
}
