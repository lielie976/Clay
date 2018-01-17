import { debounce } from 'underscore'
import { reachWindowBottom } from '~/utils/helpers'

export default {
  methods: {
    handleScroll: debounce(function () {
      if (reachWindowBottom()) {
        this.reachedBottom()
      }
    }, 250)
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroued () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
