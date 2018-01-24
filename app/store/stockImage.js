
import { getStockImage } from '~/api/theme'
import isRetina from 'is-retina'
let pixel = isRetina() ? 'h1' : 'n1'

export const state = () => ({
  stockImage: {
  }
})

export const mutations = {
  addItem (state, { id, image }) {
    if (!state.stockImage[id]) {
      state.stockImage[id] = image ? 'data:image/png;base64,' + image : null;
    }
  }
}

export const actions = {
  setItem (context, { id, path }) {
    if (context.state.stockImage[id]) {
      return new Promise((resolve, reject) => {
        resolve(context.state.stockImage[id])
      })
    } else {
      if (path) {
        return getStockImage({
          path,
          pixel
        }).then(res => {
          let item = {
            id: id,
            image: res.data.ImgStr
          }
          context.commit('addItem', item)
          return context.state.stockImage[id]
        }).catch(e => {
          console.log(e)
          return new Promise((resolve, reject) => {
            resolve('')
          })
        })
      } else {
        let item = {
          id: id,
          image: ''
        }
        context.commit('addItem', item)
        return context.state.stockImage[id]
      }
    }
  },
  getImage: (context, id) => {
    return context.state.stockImage[id] ? context.state.stockImage[id] : null
  }
}
