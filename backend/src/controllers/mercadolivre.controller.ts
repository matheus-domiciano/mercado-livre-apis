// src/controllers/video.controller.ts

import { Request, Response } from "express";
import * as MercadoLivreServices from "../services/mercadolivre.services";

interface GetProductsProps {
  q: string;
  sort?: string;
  category?: string;
  offset?: string;
  limit?: string;
}

export async function codeToRefreshToken(req: Request, res: Response) {
    const apiResponse = await MercadoLivreServices.getRefreshToken();
    return res.status(200).json(apiResponse); 
}

export async function refreshToAccessToken(req: Request, res: Response) {
    const apiResponse = await MercadoLivreServices.getAccessToken();
    return res.status(200).json(apiResponse); 
}



export async function searchProducts(req: Request<{}, {}, {}, GetProductsProps>, res: Response) {
  const params = req.query;
  const apiResponse = await MercadoLivreServices.getProducts(params)
  return res.status(200).json(apiResponse);
}

export async function createAffiliateLink(req: Request, res: Response) {
  try {
    
    if(!req.body) res.status(400).json({'error': 'No body found'});

    const { prods } = req.body;
    const apiResponse = await MercadoLivreServices.createAffiliateUrls(prods);

    return res.status(200).json(apiResponse);

  } catch (err: any) {
    console.error("Generate link error:", err);
    return res.status(400).json({ message: err.message });
  }
}

interface ProdProps {
  prod: string;
}


export async function scrapMercadoLivreProducts(req: Request, res: Response) {

    const { prod } = req.params

    const params: ProdProps = { 
      prod
     };

    const apiResponse = await MercadoLivreServices.scrapMLProds(params);
    return res.status(200).json(apiResponse); 
}

