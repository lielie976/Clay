import { getFastSubjects } from '~/api/subject'
import { getHomeMsgs } from '~/api/message'

export const state = () => ({
  activeFixedSubjects: [],
  hotSubjects: [],
  activeHotSubjects: null,
  hasExplain: false,
  headmark: null,
  tailmark: null,
  limit: 30,
  msgIdMark: null,
  msgs: [],
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
    let subj
    if (activeHotSubjects) {
      subj = {
        subjids: activeHotSubjects,
        isHotSubject: true
      }
    } else if (activeFixedSubjects.length) {
      subj = {
        subjids: activeFixedSubjects.join(','),
        hasExplain: hasExplain ? true : undefined
      }
    } else {
      subj = {
        subjids: '9,10,723,35,469',
        hasExplain: hasExplain ? true : undefined
      }
    }
    return {
      ...subj,
      limit: 30
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
  },
  saveMsgs (state, data) {
    console.log(data)
    state.msgs = data.NewMsgs
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
        resolve()
      }).catch(err => reject(err))
    })
  },
  setActiveHotSubject ({ commit }, id) {
    commit('setActiveHotSubject', id)
  },
  getMsgs ({ commit, getters }) {
    return new Promise((resolve, reject) => {
      getHomeMsgs(getters.msgsParams).then((res) => {
        commit('saveMsgs', res)
        resolve()
      }).catch(err => reject(err))
    })
  }
}
