import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

const coursePath = defineNoteConfig({
  dir: 'course',
  link: '/course',
  sidebar: 'auto',
})

export const notes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [coursePath],
})
