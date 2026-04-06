import { PoolDetailClient } from './PoolDetailClient';

export async function generateStaticParams() {
  // We return an empty array to satisfy the static export requirement.
  // Dynamic routes in a static site will fall back to client-side data fetching.
  return [];
}

export default function PoolDetailPage({ params }: { params: { id: string } }) {
  return <PoolDetailClient id={params.id} />;
}
