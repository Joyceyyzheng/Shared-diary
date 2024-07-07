import { kv } from "@vercel/kv"

export async function POST(req) {
  console.log("req = " + req)

  let userUploadedFileUrlsKey = `uploaded_file_urls_global`
  const data = await kv.get(userUploadedFileUrlsKey)
  console.log("data", data)
  // let urls = (await client.get(userUploadedFileUrlsKey)).value;
  // let urls = JSON.parse(cart)
  // if (urls === undefined) {
  //   urls = []
  // }

  // must convert array to a JSON string before sending as http
  // res.status(200).contentType("text/json").end(JSON.stringify(urls))

  return new Response(JSON.stringify(data))
  //return new Response(data)
  //return new Response.json({ urls })
}
