import { PoolDetailClient } from './PoolDetailClient';

// Ensure the page is treated as a static export
export const dynamic = 'force-static';
export const dynamicParams = false;

/**
 * generateStaticParams is required for dynamic routes when using 'output: export'.
 * This version provides a fallback to ensure the build passes even if pools are not yet fetched.
 */
export async function generateStaticParams() {
  try {
    // In a real production build, you might fetch active pool IDs from your API/Contract here.
    // For the static export to succeed, we provide at least one valid path.
    return [{ id: '1' }];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function PoolDetailPage({ params }: { params: { id: string } }) {
  return <PoolDetailClient id={params.id} />;
}
