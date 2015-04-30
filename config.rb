activate :dotenv
activate :i18n, mount_at_root: false

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

set :url_root, ENV.fetch("URL_ROOT")
set :analytics_key, ENV.fetch("ANALYTICS_KEY")

page "index.html", :layout => :article_layout

configure :build do
end

helpers do
  def render_partial(partial_name, opts = {})
    partial "partials/#{partial_name}", opts
  end
end
