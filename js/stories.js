"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <button type="button" class="story-favorite">&#9733;</button>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */


function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}



/** add story to story list */
async function clickAddStory(evt) {
  evt.preventDefault();
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();
  const story = await storyList.addStory(currentUser, { title, author, url });
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $addStoryForm.hide();
  $addStoryForm.trigger("reset");

}

$addStoryForm.on("submit", clickAddStory);


function putFavoriteOnPage() {
  $favStoryList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favStoryList.append($story);
  }
  $favStoryList.show();
}

function addStoryToFavorites(story) {
  console.log(story);
  currentUser.addFavoriteStory(story);
}

$(".story-favorite").on("click", addStoryToFavorites)