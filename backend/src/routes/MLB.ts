import { Router } from "express";
import * as MercadoLivreController from "../controllers/mercadolivre.controller"

const router = Router();

router.post('/oauth/refresh-token', MercadoLivreController.codeToRefreshToken)
router.post('/oauth/access-token', MercadoLivreController.refreshToAccessToken)
router.post('/generate/affiliate-link', MercadoLivreController.createAffiliateLink)
router.get('/search', MercadoLivreController.searchProducts)
router.get('/scrap/products/:prod', MercadoLivreController.scrapMercadoLivreProducts)

export default router;