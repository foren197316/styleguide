require 'spec_helper'

feature 'Index' do
  scenario 'Shows StyleGuide' do
    visit '/'
    expect(page).to have_content 'StyleGuide'
  end
end
