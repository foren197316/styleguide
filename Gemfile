# If you do not have OpenSSL installed, update
# the following line to use "http://" instead
source 'https://rubygems.org'

ruby '2.2.0'

gem 'middleman'
gem 'middleman-dotenv'
gem 'middleman-search_engine_sitemap'
gem 'bootstrap-sass', '~> 3.3.4', require: false
gem 'font-awesome-sass', '~> 4.3.0', require: false

group :development do
  gem 'rake'
  gem 'dotenv'
  gem 'pivotal_git_scripts'
  gem 'foreman'
end

group :test do
  gem 'rspec'
  gem 'capybara'
end

group :production do
  gem 'puma'
  gem 'rack-contrib'
  gem 'rack-cors', require: 'rack/cors'
  gem 'rack-domain'
  gem 'rack-ssl'
end
