/**
 * Handle four kinds of content types of HTTP request using a ajax method.
 * Four content types of HTTP requests:
 *      raw, binary, x-www-form-urlencoded, form-data
 */
import HTTP from './HTTP'
import Util from '../util'

/* default export; function */
/**
 * Request a resource, handle it using our HTTP response format in a standard mode:
 *
 * if(res.status) {
   * // if succeeded
   * } else {
   * // if failed
   * }
 *
 * @param method {String} the request method
 * @param url {String} the resource path
 * @param data {Object | FormData} the data type sent to the server
 * @param success {Function} the success handler
 * @param failure {Function} the failure handler
 */
export default function ajax ({method, url, data = null, success = null, failure = null}) { // the parameter sequence must be stable; follow a common pattern
  switch (method) {
    case 'GET':
      HTTP.get(url, success)
        .then(res => {
          if (res.data.status) {
            success(res.data)
          } else {
            Util.toast(res.data.message, 'failed', 1500)
            if (failure) failure(res.data)
          }
        })
        .catch(err => {
          if (err.response) { // the property of the object exists
            Util.toast(err.response.data.message, 'failed', 1500)
          } else if (err.request) { // the property of the object exists
            Util.toast(err.request, 'failed', 2000)
          } else {
            Util.toast(err, 'failed', 2000)
          }
        })

      break
    case 'POST':
      const configs = { // object property shorthand; object initializer
        method,
        url,
        data
      }

      HTTP(configs)
        .then(res => {
          if (res.data.status) { // res.data -> res body
            success(res.data) // async request process
          } else {
            Util.toast(res.data.message, 'failed', 1500)
            if (failure) failure(res.data)
          }
        })
        .catch(err => {
          if (err.response) { // the object property exists; detection
            Util.toast(err.response.data.message, 'failed', 1500)
          } else if (err.request) {
            Util.toast(err.request, 'failed', 2000)
          } else {
            Util.toast(err, 'failed', 2000)
          }
        })
      break
    case 'PUT':
      break
    case 'DELETE':
      break
    default:
      /* occur an exception, certainly */
      try {
        throw new RangeError('The method of the HTTP request is not allowed', 'ajax.js')
      } catch (e) { // catch the exception at the current level, Error ins
        console.warn(e.message) // the error message; ins property
      }
  }
}
