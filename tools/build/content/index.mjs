/** Pages authored through the component library, in navigation order. */

import { ai } from "./ai.mjs";
import { blogPages } from "./blog.mjs";
import { enterprise } from "./enterprise.mjs";
import { higherEducation } from "./higher-education.mjs";
import { home } from "./home.mjs";
import { platform } from "./platform.mjs";
import { schools } from "./schools.mjs";
import { skills } from "./skills.mjs";
import { topicPages } from "./topics.mjs";

export const newPages = [
  home,
  platform,
  ai,
  skills,
  schools,
  higherEducation,
  enterprise,
  ...topicPages,
  ...blogPages,
];
