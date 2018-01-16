import { getFastSubjects } from '~/api/subject'
import { getHomeMsgs } from '~/api/message'

export const state = () => ({
  activeFixedSubjects: [],
  hotSubjects: [],
  activeHotSubjects: null,
  hasExplain: false,
  headmark: null,
  tailmark: null,
  tailMsgId: null,
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
    const { activeHotSubjects, hasExplain, activeFixedSubjects, headmark, tailmark, msgIdMark } = state
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
        subjids: hasExplain ? undefined : '9,10,723,35,469',
        hasExplain: hasExplain ? true : undefined
      }
    }
    return {
      ...subj,
      limit: 30,
      headmark,
      tailmark,
      msgIdMark
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
    state.activeHotSubjects = null
  },
  saveHotSubjects (state, data) {
    state.hotSubjects = data
  },
  setActiveHotSubject (state, payload) {
    const { value, id } = payload
    state.activeHotSubjects = value ? id : null
    state.activeFixedSubjects = []
    state.hasExplain = false
  },
  saveMsgs (state, data) {
    state.headmark = data.HeadMark !== '0' ? data.HeadMark : undefined
    state.tailmark = data.TailMark !== '0' ? data.TailMark : undefined
    state.msgIdMark = data.TailMsgId !== '0' ? data.TailMsgId : undefined
    state.msgs = data.NewMsgs
  },
  appendMsgs (state, data) {
    if (!data.NewMsgs) return
    state.tailmark = data.TailMark !== '0' ? data.TailMark : undefined
    state.msgIdMark = data.TailMsgId !== '0' ? data.TailMsgId : undefined
    state.msgs = [...state.msgs, ...data.NewMsgs]
  },
  refreshMsgs (state, data) {
    let { msgs } = state
    const { NewMsgs, DeletedMsgs, UpdatedMsgs, HeadMark } = data
    if (NewMsgs && NewMsgs.length) {
      msgs = [...NewMsgs.reverse(), ...msgs]
    }
    if (DeletedMsgs && DeletedMsgs.length) {
      const deletedMsgIds = DeletedMsgs.map(i => i.Id)
      msgs = msgs.filter(msg => deletedMsgIds.indexOf(msg.Id) === -1)
    }
    if (UpdatedMsgs && UpdatedMsgs.length) {
      const updatedMsgsMap = {}
      UpdatedMsgs.forEach((msg) => {
        updatedMsgsMap[msg.Id] = msg
      })
      msgs = msgs.map((msg) => {
        return updatedMsgsMap[msg.Id] || msg
      })
    }
    state.headmark = HeadMark !== '0' ? HeadMark : state.headmark
    state.msgs = msgs
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
  selectFixedSubject ({ commit, dispatch }, payload) {
    commit('selectFixedSubject', payload)
    dispatch('getMsgs')
  },
  toggleExplain ({ commit, dispatch }) {
    commit('toggleExplain')
    dispatch('getMsgs')
  },
  getHotSubjects ({ commit }) {
    return new Promise((resolve, reject) => {
      getFastSubjects().then((res) => {
        commit('saveHotSubjects', res)
        resolve()
      }).catch(err => reject(err))
    })
  },
  setActiveHotSubject ({ commit, dispatch }, payload) {
    commit('setActiveHotSubject', payload)
    dispatch('getMsgs')
  },
  getMsgs ({ commit, getters }) {
    return new Promise((resolve, reject) => {
      getHomeMsgs({
        ...getters.msgsParams,
        headmark: undefined,
        tailmark: undefined,
        msgIdMark: undefined
      }).then((res) => {
        commit('saveMsgs', res)
        resolve()
      }).catch(err => reject(err))
    })
  },
  loadMore ({ commit, getters }) {
    getHomeMsgs({
      ...getters.msgsParams,
      headmark: undefined
    }).then((res) => {
      commit('appendMsgs', res)
    })
  },
  refreshMsgs ({ commit, getters }) {
    getHomeMsgs({
      ...getters.msgsParams,
      tailmark: undefined,
      msgIdMark: undefined
    }).then((res) => {
      commit('refreshMsgs', res)
    })
  }
}
