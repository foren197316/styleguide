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
    system "git rm * -r --ignore-unmatch"
    system "mv #{tmp}/* ."
    system "git add ."
    message = "Site updated at #{Time.now.utc}"
    system "git commit -am #{message.shellescape}"
    system "git push origin gh-pages --force"
    system "git checkout master"
    system "echo yolo"
  end
end

task :default => [:deploy]