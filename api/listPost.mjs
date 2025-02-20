import { kv } from "@vercel/kv"

export async function POST(req) {
  console.log("req = " + req)

  let userUploadedFileUrlsKey = `uploaded_file_urls_global`
  const data = await kv.get(userUploadedFileUrlsKey)
  console.log("data", data)

  // must convert array to a JSON string before sending as http

  return new Response(JSON.stringify(data))
}
