import axios from "axios";
import dotenv from "dotenv";
import * as cheerio  from "cheerio";
import { each } from "cheerio/dist/commonjs/api/traversing";

dotenv.config();

const CSRF = process.env.ML_CSRF;
const COOKIE = process.env.ML_COOKIE;
const TAG = process.env.ML_TAG; // seu código de afiliado


type affiliateLinkProps = {
  tag?: string;
  prods: object[]
}

type getProductsProps = {
  q: string; 
  sort?: string; 
  category?: string; 
  offset?: string;
  limit?: string;
  frete_gratis?: string
}

export async function getRefreshToken() {

  const PRINCIPAL_URL = 'https://api.mercadolibre.com/oauth/token'

    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: '712227867973587',
      client_secret: 'CfcKvS6a3zFARiTdSeRAyVwxljBfMSqF',
      code: 'TG-6938e08c8a050000018d98e1-3053502995',
      redirect_uri: 'https://giftgenius.space',
    });

  const { data } = await axios.post(PRINCIPAL_URL, params.toString(), { headers });  
  return data
  
}

export async function getAccessToken() {

  const PRINCIPAL_URL = 'https://api.mercadolibre.com/oauth/token'

    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: '712227867973587',
      client_secret: 'CfcKvS6a3zFARiTdSeRAyVwxljBfMSqF',
      code: 'TG-6938d862a1ce6700012dd298-158293791',
      redirect_uri: 'https://giftgenius.space',
    });

  const { data } = await axios.post(PRINCIPAL_URL, params.toString(), { headers });  
  return data
  
}


export async function createAffiliateUrls(productUrls: affiliateLinkProps) {
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


export async function getProducts(params: getProductsProps) {

    const { q, sort, category, offset, limit, frete_gratis } = params;

    try {

      const BASE_URL = 'https://api.mercadolibre.com/sites/MLB/search'

      const BASE_URL2 = 'https://api.mercadolibre.com/products/search'
      

      const ACCESS_TOKEN = 'APP_USR-712227867973587-120922-7090d9a3a29db17377126eecb88ddb6e-3053502995'

      const header = {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`
        }
      }

      const { data } = await axios.get('https://api.mercadolibre.com/sites/MLB/search', {
        params: { q: 'iphone' },
        ...header
      });

      return data

  } catch (error) {
    return error
  }

}


interface ScrapProdProps {
  title: string;
  price: string;
  image: string;
  url?: string;
}

interface ProdProps {
  prod: string;
}


export async function scrapMLProds(params: ProdProps): Promise<ScrapProdProps[]> {

  const { prod } = params

  const URL = `https://lista.mercadolivre.com.br/${prod}`;

  const { data } = await axios.get(URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "pt-BR,pt;q=0.9",
    },
  });

  const $ = cheerio.load(data);

  const products: ScrapProdProps[] = [];

  $(".ui-search-layout__item").each((_, el) => {
    const $el = $(el); 

    const title = $el.find(".poly-component__title").text().trim();

    const image = $el.find("img.poly-component__picture").attr("data-src") 
  || $el.find("img.poly-component__picture").attr("src") 
  || "";

    const priceFraction = $el
      .find(".poly-price__current .andes-money-amount__fraction")
      .first()
      .text()
      .trim();

    const currency = $el
      .find(".poly-price__current .andes-money-amount__currency-symbol")
      .first()
      .text()
      .trim();

    const price = `${currency} ${priceFraction}`; 

    const url =
      $el.find(".poly-component__title-wrapper a.poly-component__title").attr("href") || "";

      // Debug pra ver todos os atributos da imagem
    //const imgEl = $el.find("img").first();
    //console.log(imgEl.attr()); // mostra todos os atributos

    if (title && priceFraction && image) {
      products.push({
        title,
        price,
        image,
        url,
      });
    }
  });

  return products;
}