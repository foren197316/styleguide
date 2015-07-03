require 'rack/cors'

activate :dotenv
activate :i18n, mount_at_root: false

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

set :analytics_key, ENV.fetch('ANALYTICS_KEY')

set :root_url, ENV.fetch('ROOT_URL')
set :cdn_url, ENV.fetch('CDN_URL')

page 'examples/dialog.html', layout: :blank_layout

configure :build do
end

helpers do
  def render_partial(partial_name, opts = {})
    partial "partials/#{partial_name}", opts
  end
end

use Rack::Cors do
  allow do
    origins '*'
    resource '*',
      headers: :any,
      methods: [:get, :options]
  end
end

set :url_root, root_url
