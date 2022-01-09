import { Router } from 'express'
import requireUser_routes from './requireUser_routes'
import requireActiveUser_routes from './requireActiveUser_routes'
import public_routes from './public_routes'

const router = Router()

router.use(public_routes)
router.use(requireUser_routes)
router.use(requireActiveUser_routes)

export default router
