require 'rubygems'
require 'rake'
require 'rdoc'
require 'date'
require 'yaml'
require 'tmpdir'
require 'jekyll'

task :build do
  system "gulp build"
end

task :deploy => [:build] do
  Dir.mktmpdir do |tmp|
    system "cp -R build/* #{tmp}"
    system "git co gh-pages"
    system "rm -rf *"
    system "mv #{tmp}/* ."
    system "git add ."
    message = "Site updated at #{Time.now.utc}"
    system "git commit -am #{message.shellescape}"
    system "git push origin gh-pages --force"
    system "git checkout master"
    system "echo yolo"
    system "npm install"
    system "bower install"
  end
end

task :default => [:deploy]
