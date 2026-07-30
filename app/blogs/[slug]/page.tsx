import Link from "next/link";
import Image from "next/image";
import { blogs } from "../data";
import Navbar from "@/app/components/Navbar";


type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogDetails({ params }: Props) {
  const { slug } = await params;

  const blog = blogs.find((item) => item.slug === slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-red-600">
          Blog Not Found
        </h1>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-10">

        <h1 className="text-5xl font-bold text-blue-700 mb-4">
          {blog.title}
        </h1>
        <Image
          src={blog.image}
          alt={blog.title}
          width={900}
          height={500}
          className="w-full h-96 object-cover rounded-xl mb-6"
        />

        <div className="flex gap-6 text-gray-500 mb-8 border-b pb-4">
          <p>👤 {blog.author}</p>
          <p>📅 {blog.date}</p>
        </div>

        <p className="text-lg text-gray-700 leading-9">
          {blog.content}
        </p>

        <Link
          href="/blogs"
          className="inline-block mt-10 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          ← Back to Blogs
        </Link>

      </div>
    </div>
    </>
  );
}

