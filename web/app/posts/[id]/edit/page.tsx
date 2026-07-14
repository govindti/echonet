import { apiFetch } from "@/lib/api";
import type { Post } from "@/lib/types";
import PostForm from "@/components/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let post: Post;
  try {
    post = await apiFetch<Post>(`/api/v1/posts/${id}`);
  } catch {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-gray-500">Post not found.</p>
      </div>
    );
  }

  return (
    <PostForm
      mode="edit"
      postId={post.id}
      initialTitle={post.title}
      initialContent={post.content}
      initialTags={post.tags?.join(", ") || ""}
    />
  );
}
