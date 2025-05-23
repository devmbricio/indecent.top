
import MorePosts from "@/components/MorePosts";
import SinglePost from "@/components/SinglePost";
import { SinglePostSkeleton } from "@/components/Skeletons";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

function PostPage({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <Suspense fallback={<SinglePostSkeleton />}>
        <SinglePost id={id} />
      </Suspense>

      <Separator className="my-12 max-w-2xl  lg:max-w-3xl pr-2 pl-2 mx-auto" />

      <Suspense>
        <MorePosts postId={id} />
      </Suspense>
    </div>
  );
}
export default PostPage;
