import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CSRF = process.env.ML_CSRF;
const COOKIE = process.env.ML_COOKIE;
const TAG = process.env.ML_TAG; // seu código de afiliado

export default async function createAffiliateUrls(productUrls) {
  const url = "https://www.mercadolivre.com.br/affiliate-program/api/v2/affiliates/createLink";

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "X-CSRF-Token": CSRF,
    "Cookie": COOKIE,
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "Origin": "https://www.mercadolivre.com.br",
    "Referer": "https://www.mercadolivre.com.br/afiliados/linkbuilder",
    "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
  };

  const body = {
    tag: TAG,
    site_id: "MLB",
    urls: productUrls,
  };

  const response = await axios.post(url, body, { headers });
  return response.data;
}
