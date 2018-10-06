import { configure } from '@storybook/vue';

function loadStories() {
  require('../stories/index.stories')
}

configure(loadStories, module);
