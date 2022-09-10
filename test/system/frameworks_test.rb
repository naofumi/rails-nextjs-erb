require "application_system_test_case"

class FrameworksTest < ApplicationSystemTestCase
  setup do
    @framework = frameworks(:one)
  end

  test "visiting the index" do
    visit frameworks_url
    assert_selector "h1", text: "Frameworks"
  end

  test "should create framework" do
    visit frameworks_url
    click_on "New framework"

    fill_in "Category", with: @framework.category_id
    fill_in "Description", with: @framework.description
    fill_in "Name", with: @framework.name
    fill_in "Website", with: @framework.website
    click_on "Create Framework"

    assert_text "Framework was successfully created"
    click_on "Back"
  end

  test "should update Framework" do
    visit framework_url(@framework)
    click_on "Edit this framework", match: :first

    fill_in "Category", with: @framework.category_id
    fill_in "Description", with: @framework.description
    fill_in "Name", with: @framework.name
    fill_in "Website", with: @framework.website
    click_on "Update Framework"

    assert_text "Framework was successfully updated"
    click_on "Back"
  end

  test "should destroy Framework" do
    visit framework_url(@framework)
    click_on "Destroy this framework", match: :first

    assert_text "Framework was successfully destroyed"
  end
end
