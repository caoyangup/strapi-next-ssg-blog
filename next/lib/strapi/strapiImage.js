
export function strapiImage(url) {

  const apiurl = process.env.NEXT_PUBLIC_STRAPI_API_URL// || 'http://localhost:1337';
  // console.log('url.startsWith("/") && !process.env.PUBLIC_STRAPI_SYNC_UPLOADS', url.startsWith("/") && !process.env.PUBLIC_STRAPI_SYNC_UPLOADS);
  // if (url.startsWith("/") && !process.env.NEXT_PUBLIC_STRAPI_SYNC_UPLOADS) {
  //   console.log('apiurl + url', apiurl + url); 
  //   return apiurl + url
  // }
  return url
}