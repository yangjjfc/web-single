
import { setPublicPath } from 'systemjs-webpack-interop'
import config from '../project';
setPublicPath(config.name)