import { redirectPremiumSubject } from '~/utils/constants'

export default function ({ params, redirect }) {
  //  自营付费话题
  const redirectUrl = redirectPremiumSubject[params.id]
  if (redirectUrl) {
    return redirect(redirectUrl)
  }
}
