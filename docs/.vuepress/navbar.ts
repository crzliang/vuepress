import { defineNavbarConfig } from 'vuepress-theme-plume'

export const navbar = defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '博客', link: '/blog/' },
  {
    text: '笔记',
    items: [{ text: '课程笔记', link: '/notes/course/README.md' }]
  },
])
