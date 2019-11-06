const path = require('path')
const dotenv = require('dotenv')

const envPath = path.resolve('.env')
dotenv.config({ path: envPath })
