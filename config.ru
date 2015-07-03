#\ -s puma
require 'dotenv'
Dotenv.load

require 'rack'
require 'rack/contrib/try_static'
require 'rack/cors'
require 'rack/domain'
require 'rack/ssl'

use Rack::SSL if ENV['USE_SSL']

use Rack::Cors do
  allow do
    origins '*'
    resource '*',
      headers: :any,
      methods: [:get, :options]
  end
end

map '/' do
  use Rack::TryStatic, root: 'build', urls: %w[/], try: %w(/index.html)
end

four_oh_four = [ 404, { 'Content-Type'  => 'text/html', 'Cache-Control' => 'public, max-age=1' }, [ File.read(File.expand_path('../build/404/index.html', __FILE__)) ] ]
run lambda { |env| four_oh_four }
