import { PoolDetailClient } from './PoolDetailClient';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    return [{ id: '1' }];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function PoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PoolDetailClient id={id} />;
}
