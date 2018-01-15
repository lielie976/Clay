import { getAvailableAd } from '~/api/settings'

function isDifferentBanner (old, newOne) {
  return (old.Id !== newOne.Id) || (old.ImgUrl !== newOne.ImgUrl) || (old.RedirectUrl !== newOne.RedirectUrl)
}

export const state = () => ({
  bannerInfo: {
    hided: true,
    info: {}
  }
})

export const mutations = {
  saveBanner (state, data) {
    const localBannerInfo = JSON.parse(localStorage.getItem('BANNER_INFO') || '{}')
    const bannerInfo = {
      info: data
    }
    if (localBannerInfo.info && isDifferentBanner(localBannerInfo.info, data)) {
      bannerInfo.hided = false
    } else {
      bannerInfo.hided = localBannerInfo.hided
    }
    state.bannerInfo = bannerInfo
    localStorage.setItem('BANNER_INFO', JSON.stringify(bannerInfo))
  },
  hideBanner (state) {
    const bannerInfo = {
      ...state.bannerInfo,
      hided: true
    }
    state.bannerInfo = bannerInfo
    localStorage.setItem('BANNER_INFO', JSON.stringify(bannerInfo))
  }
}

export const actions = {
  getBanner ({ commit }) {
    return new Promise((resolve, reject) => {
      getAvailableAd({ PosIds: 600001 }).then((res) => {
        const data = res.find(i => i.PosId === 600001)
        if (!data) return
        commit('saveBanner', data)
        resolve()
      }).catch(err => reject(err))
    })
  },
  hideBanner ({ commit }) {
    commit('hideBanner')
  }
}
