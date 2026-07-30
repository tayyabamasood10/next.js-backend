import Link from "next/link";
import Navbar from "../components/Navbar";

import { blogs } from "./data";


export default function BlogPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 py-12 px-6">
                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-blue-700">Our Blog</h1>
                    <p className="text-gray-600 mt-4 text-lg">
                        Read our latest articles and stay updated.
                    </p>
                </div>

                {/* Blog Cards */}
                <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition"
                        >
                            <h2 className="text-2xl font-bold text-blue-600 mb-3">
                                {blog.title}
                            </h2>

                            <p className="text-gray-600 mb-4">{blog.description}</p>

                            <div className="flex justify-between text-sm text-gray-500 mb-6">
                                <span>👤 {blog.author}</span>
                                <span>📅 {blog.date}</span>
                            </div>

                            <Link
                                href={`/blogs/${blog.slug}`}
                                className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg">
                                Read More
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}


