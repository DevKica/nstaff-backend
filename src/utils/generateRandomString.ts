import crypto from 'crypto'

const generateRandomString = ()=>crypto.randomBytes(64).toString('hex')+Date.now()

export default generateRandomString