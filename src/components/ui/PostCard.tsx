import { formatDate, getPostExcerpt } from "@/lib";
import type { WpPostEdge } from "@/types/wp";

const PostCard: React.FC<{ post: WpPostEdge }> = ({ post }) => {
  return (
    <a href={`blog/${post.node.slug}`} key={post.node.postId} rel="noopener">
      <article class="col-span-2 sm:col-span-1 px-2 lg:px-4 py-4 bg-non-photo-blue-700 rounded-lg hover:cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300">
        <img
          src={
            post.node.featuredImage.node.sourceUrl ||
            `https://picsum.photos/400/400`
          }
          alt={`${post.node.title}`}
          class="w-full h-48 xl:h-54 rounded-lg"
          loading="lazy"
          width="400"
          height="400"
        />

        <h3 class="capitalize text-xl font-semibold mt-4 text-federal-blue-600">
          {post.node.title}
        </h3>

        <div class="flex flex-col lg:flex-row lg:justify-between gap-2 mt-4">
          <a href={`blog/categories/${post.node.categories?.nodes[0].slug}`}>
            <span class="text-xs rounded-full px-2 py-1 bg-honolulu-blue-600 text-light-cyan-600 w-fit">
              {post.node.categories?.nodes[0].name}
            </span>
          </a>
          <div class="text-xs text-pacific-cyan-300 col-span-2 lg:col-span-1 flex items-center justify-start lg:justify-end">
            <i class="ti ti-calendar-week" />
            <span>{formatDate(post.node.date)}</span>
          </div>
        </div>

        <div class="mt-4 text-sm">{getPostExcerpt(post.node.excerpt)}</div>
      </article>
    </a>
  );
};

export default PostCard;
