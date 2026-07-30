export type Blog = {
  id: number;
  title: string;
  slug: string;
  description: string;
  author: string;
  date: string;
  image: string;
  content: string;
};

export const blogs: Blog[] = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    slug: "getting-started-with-next",
    description:
      "Learn how to build fast and modern web applications using Next.js.",
    author: "John Doe",
    date: "10 July 2026",
    image: "/images/nextjs.png",
    content:
      "Next.js is a powerful React framework that enables server-side rendering, static site generation, and API routes. It helps developers build fast, scalable, and SEO-friendly applications. In this article, you'll learn about routing, components, layouts, and much more.",
  },
  {
    id: 2,
    title: "Why Tailwind CSS is Amazing",
    slug: "why-tailwind-css-is-amazing",
    description:
      "Discover how Tailwind CSS helps developers create responsive designs.",
    author: "Sarah Khan",
    date: "8 July 2026",
    image: "/images/nextjs.png",
    content:
      "Tailwind CSS is a utility-first CSS framework that provides pre-built classes for styling. It speeds up development and helps maintain consistency across projects.",
  },
  {
    id: 3,
    title: "Understanding React Components",
    slug: "understanding-react-components",
    description:
      "A beginner-friendly guide to reusable components and props in React.",
    author: "Ali Ahmed",
    date: "5 July 2026",
    image: "/images/nextjs.png",
    content:
      "React components are reusable building blocks of a React application. They help organize your UI, improve code reuse, and make applications easier to maintain.",
  },
];