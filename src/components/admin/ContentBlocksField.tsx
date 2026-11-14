import { useLayoutEffect, useRef, type ChangeEvent } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { CharacterImageField } from '@/components/admin/CharacterImageField';
import { createBlockDraft, type BlockDraft } from '@/lib/characterForm';

interface Props {
  label: string;
  blocks: BlockDraft[];
  onChange: (blocks: BlockDraft[]) => void;
}

const EDITOR_CLASS =
  'space-y-3 rounded-lg border border-zinc-300 bg-white p-3 transition focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-300/60';

const TEXTAREA_CLASS =
  'block w-full resize-none overflow-hidden bg-transparent px-1 py-1 text-sm leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400';

const ADD_BUTTON_CLASS =
  'inline-flex h-9 items-center gap-1.5 rounded-lg border border-dashed border-zinc-400 px-3 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900';

export function ContentBlocksField({ label, blocks, onChange }: Props) {
  const replace = (next: BlockDraft) => {
    onChange(blocks.map((block) => (block.key === next.key ? next : block)));
  };

  const removeImage = (key: string) => {
    const imageIndex = blocks.findIndex((block) => block.key === key);
    if (imageIndex === -1) return;

    const nextBlocks = blocks.filter((block, index) => {
      if (index === imageIndex) return false;
      const isFollowingEmptyText =
        index === imageIndex + 1 && block.kind === 'text' && block.text.trim() === '';
      return !isFollowingEmptyText;
    });
    onChange(nextBlocks);
  };

  const addImage = () => {
    onChange([...blocks, createBlockDraft('image'), createBlockDraft('text')]);
  };

  let imageNumber = 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-zinc-800">{label}</p>
        <button type="button" onClick={addImage} className={ADD_BUTTON_CLASS}>
          <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
          이미지 추가
        </button>
      </div>
      <div className={EDITOR_CLASS}>
        {blocks.map((block) => {
          if (block.kind === 'text') {
            return (
              <AutoGrowTextarea
                key={block.key}
                aria-label={`${label} 내용`}
                placeholder="내용을 입력해 주세요."
                value={block.text}
                onChange={(event) => replace({ key: block.key, kind: 'text', text: event.target.value })}
              />
            );
          }

          imageNumber += 1;
          const number = imageNumber;
          return (
            <div key={block.key} className="relative rounded-lg bg-zinc-50 p-3">
              <CharacterImageField
                label={`${label} 이미지 ${number}`}
                slot={block.image}
                onChange={(slot) => replace({ key: block.key, kind: 'image', image: slot })}
              />
              <button
                type="button"
                onClick={() => removeImage(block.key)}
                aria-label={`${label} 이미지 ${number} 블록 삭제`}
                title="이미지 블록 삭제"
                className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-500 transition hover:border-red-500 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface AutoGrowTextareaProps {
  value: string;
  placeholder: string;
  'aria-label': string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

function AutoGrowTextarea({ value, ...props }: AutoGrowTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);

  return <textarea ref={ref} rows={1} value={value} className={TEXTAREA_CLASS} {...props} />;
}
