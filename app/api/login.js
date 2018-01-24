import api from './index';

export const userLogin = ({ Mobile, Password }) => {
  return api({
    method: 'post',
    url: '/api/account/mobile_login',
    data: {
      Mobile,
      Password
    }
  })
}

export const fetchVcodeImage = () => {
  return api({
    method: 'GET',
    url: '/api/misc/captcha',
    headers: {
    },
    params: {
      width: 260,
      height: 120
    }
  })
}

export const fetchMobileCode = ({Mobile, CaptchaId, CaptchaSolution}) => {
  return api({
    method: 'post',
    url: '/api/pc/mobile_register/send_code',
    data: {
      Mobile,
      CaptchaId,
      CaptchaSolution
    }
  })
}
export const verifyMobileCode = ({Mobile, Code}) => {
  return api({
    method: 'post',
    url: '/api/account/mobile_register/verify_code',
    data: {
      Mobile,
      Code
    }
  })
}

export const fetchForgetMobileCode = ({Mobile, CaptchaId, CaptchaSolution}) => {
  return api({
    method: 'post',
    url: '/api/pc/forgot_password/send_code',
    data: {
      Mobile,
      CaptchaId,
      CaptchaSolution
    }
  })
}

export const registerUser = ({Mobile, Password, Token}) => {
  return api({
    method: 'post',
    url: '/api/account/mobile_register',
    data: {
      Mobile,
      Password,
      Nickname: Mobile,
      Sex: 0,
      Token
    }
  })
}

export const verifyForgetMobileCode = ({Mobile, Code, Password}) => {
  return api({
    method: 'post',
    url: '/api/account/forgot_password/verify_code',
    data: {
      Mobile,
      Code,
      Password
    }
  })
}
