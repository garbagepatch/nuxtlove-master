import Strapi from 'strapi-sdk-javascript/build/main'

const apiUrl = process.env.API_URL || 'http://24.60.30.82'
const strapi = new Strapi(apiUrl)

export default strapi
export {
  apiUrl
}
