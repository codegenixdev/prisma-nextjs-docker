import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const posts = await db.post.findMany();

  const handleSubmit = async (formData: FormData) => {
    "use server";
    const title = (formData.get("title") as string) || "";
    const content = (formData.get("content") as string) || "";

    await db.post.create({
      data: {
        title,
        content,
      },
    });

    revalidatePath("/");
  };

  const handleDelete = async (id: number) => {
    "use server";

    await db.post.delete({
      where: {
        id,
      },
    });

    revalidatePath("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-900 min-h-screen">
      <form action={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div>
          <textarea
            name="content"
            placeholder="Enter content"
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            rows={4}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Add Post
        </button>
      </form>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded bg-gray-800 border border-gray-700 shadow-sm hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-white">{post.title}</h2>
            <p className="mt-2 text-gray-300">{post.content}</p>
            <form action={handleDelete.bind(null, post.id)}>
              <button
                type="submit"
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
