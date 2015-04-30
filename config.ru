#\ -s puma
require 'dotenv'
Dotenv.load

require 'rack'
require 'rack/contrib/try_static'
require 'rack/domain'
require 'rack/ssl'

use Rack::SSL if ENV['USE_SSL']
