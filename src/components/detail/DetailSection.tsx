import type { ContentBlock } from '@/lib/data';

interface Props {
  title: string;
  blocks: ContentBlock[];
  imageSrcs: Record<string, string>;
  tone?: 'personality' | 'features';
}

export function DetailSection({ title, blocks, imageSrcs, tone }: Props) {
  const background = 'bg-[#f9f9f9]';

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-xs font-bold text-zinc-900">
        <span className="h-4 w-1 rounded-full bg-yellow-400" aria-hidden="true" />
        {title}
      </h2>
      <div className={`min-h-14 w-full rounded-xl px-5 py-4 ${background}`}>
        <div className="space-y-4 text-sm leading-7 text-zinc-700">
          {blocks.length === 0 && <span className="text-zinc-400">내용이 없습니다.</span>}
          {blocks.map((block, index) => {
            if (block.kind === 'text') {
              return (
                <p key={index} className="whitespace-pre-line break-words">
                  {block.text}
                </p>
              );
            }
            const src = imageSrcs[block.path];
            if (!src) return null;
            return <img key={index} src={src} alt="" loading="lazy" className="rounded-lg object-contain" />;
          })}
        </div>
      </div>
    </section>
  );
}
