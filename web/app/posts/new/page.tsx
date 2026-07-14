import PostForm from "@/components/PostForm";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return <PostForm mode="create" />;
}
