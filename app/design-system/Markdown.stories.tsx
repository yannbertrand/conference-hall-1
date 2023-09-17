import { Markdown } from './Markdown.tsx';
import { StoryBlock } from './StoryBlock.tsx';

const TEXT = `
## Heading  

It is rendered with **Marked**.

> And it's sanitized against XSS attacks
`;

export const Documentation = () => (
  <>
    <StoryBlock title="Default">
      <Markdown>{TEXT}</Markdown>
    </StoryBlock>

    <StoryBlock title="Medium sized text">
      <Markdown size="m">{TEXT}</Markdown>
    </StoryBlock>
  </>
);
