import Axios from 'axios'

const baseURL = 'http://daily.scrm.haoyiku.com.cn'
const HTTP = Axios.create({
  baseURL,
  transformResponse: [
    data => JSON.parse(data)
  ],
  withCredentials: true
})

export default HTTP

export {
  baseURL
}
