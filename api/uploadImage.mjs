import { put } from "@vercel/blob"
import { kv } from "@vercel/kv"

export async function POST(req) {
  const uuid = Math.random().toString().slice(2, 12)
  const formData = await req.formData()
  const imageFile = formData.get("image-upload")
  // ⚠️ The below code is for App Router Route Handlers only
  const blob = await put(uuid + ".png", imageFile, {
    access: "public",
  })

  // Username specific key in the database
  //shared diary would be the same name
  let userUploadedFileUrlsKey = `uploaded_file_urls_global`
  const currentUrls = await kv.get(userUploadedFileUrlsKey)

  // Retrieve current URLs for this user
  //let keyData = await client.get(userUploadedFileUrlsKey)
  console.log("userUploadedFileUrlsKey", userUploadedFileUrlsKey)

  //let currentUrls = JSON.parse()
  //let currentUrls = userUrlsJson ? userUrlsJson : []
  // console.log("userUrlsJson", userUrlsJson)
  console.log("currentUrls", currentUrls)
  // Add new URL and save back to the database
  let post = {
    url: blob.url,
    text: formData.get("text"), //or just req.text
    date: new Date().toISOString(),
    _name: "sent by: " + formData.get("_name"),
  }
  console.log(post)
  //currentUrls.push(imageUrl);
  currentUrls.push(post)
  await kv.set(userUploadedFileUrlsKey, currentUrls)

  return new Response("accepted")
  //res.status(200).send()
}
