const PostCardSkeleton: React.FC = () => {
  return (
    <article
      class="col-span-2 sm:col-span-1 px-2 lg:px-4 py-4 bg-non-photo-blue-700 rounded-lg animate-pulse"
      slot="fallback"
    >
      <div class="w-full h-48 xl:h-54 rounded-lg bg-gray-300"></div>

      <div class="h-6 w-full rounded-lg bg-gray-300 mt-4"></div>

      <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 mt-4">
        <div class="h-5 w-20 rounded-full bg-gray-300"></div>

        <div class="h-4 w-24 bg-gray-300"></div>
      </div>

      <div class="h-14 w-full rounded-lg bg-gray-300 mt-4"></div>
    </article>
  );
};

export default PostCardSkeleton;
