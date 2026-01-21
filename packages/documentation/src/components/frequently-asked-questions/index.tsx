import { Accordion } from '@base-ui-components/react/accordion';
import { Children, ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

import { cn } from '@hive/design-system/guild-components/cn';
import { Anchor } from '@hive/design-system/guild-components/components/anchor';
import { AttachPageFAQSchema } from '@hive/design-system/guild-components/components/faq/attach-page-faq-schema';
import { Heading } from '@hive/design-system/guild-components/components/heading';
import { ChevronDownIcon } from '../ui/icons';
import FederationQuestions from './federation-questions.mdx';
import HomeQuestions from './home-questions.mdx';
import { OpenAccordionItemWhenLinkedTo } from './open-accordion-item-when-linked-to';
import PartnersQuestions from './partners-questions.mdx';
import { questionToId } from './question-to-id';

const a = (props: ComponentPropsWithoutRef<'a'>) => (
  <Anchor
    className="hive-focus rounded underline hover:text-blue-700"
    {...props}
    href={props.href!}
  >
    {props.children!}
  </Anchor>
);

const h2 = (props: ComponentPropsWithoutRef<'h2'>) => (
  <Heading as="h2" className="basis-1/2" size="md" {...props} />
);

const UnwrapChild = (props: { children?: ReactNode }) => props.children as unknown as ReactElement;

const AccordionWrapper = (props: ComponentPropsWithoutRef<'ul'>) => (
  <>
    <Accordion.Root className="divide-beige-400 basis-1/2 divide-y max-xl:grow">
      {props.children}
    </Accordion.Root>
    <OpenAccordionItemWhenLinkedTo />
  </>
);

const AccordionItem = (props: ComponentPropsWithoutRef<'li'>) => {
  const texts = Children.toArray(props.children).filter(child => child !== '\n');

  if (texts.length === 0) {
    return null;
  }

  if (texts.length < 2) {
    console.error(texts);
    throw new Error(`Expected a question and an answer, got ${texts.length} items`);
  }

  const [first, ...answers] = texts;

  const question =
    typeof first === 'string'
      ? first
      : typeof first === 'object' && 'type' in first
        ? (first as ReactElement<{ children?: ReactNode }>).props.children
        : null;

  if (!question) return null;

  return (
    <Accordion.Item
      className="data-[open]:pb-4 relative pb-0 focus-within:z-10"
      value={question}
    >
      <div
        id={questionToId(question)}
        itemProp="mainEntity"
        itemScope
        itemType="https://schema.org/Question"
      >
        <Accordion.Header>
          <Accordion.Trigger className="hive-focus hover:bg-beige-100/80 -mx-2 my-1 flex w-[calc(100%+1rem)] items-center justify-between rounded-xl bg-white px-2 py-3 text-left font-medium transition-colors duration-[.8s] md:my-2 md:py-4">
            <span itemProp="name">{question}</span>
            <ChevronDownIcon className="size-5 [[data-open]_&]:[transform:rotateX(180deg)]" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel
          className="overflow-hidden bg-white text-green-800 data-[closed]:hidden"
          keepMounted
        >
          <div
            itemProp="acceptedAnswer"
            itemScope
            itemType="https://schema.org/Answer"
          >
            <div className="space-y-2" itemProp="text">
              {answers.map((answer, i) => (
                <p key={i}>{answer}</p>
              ))}
            </div>
          </div>
        </Accordion.Panel>
      </div>
    </Accordion.Item>
  );
};

export function FrequentlyAskedQuestions({ className }: { className?: string }) {
  return (
    <>
      <AttachPageFAQSchema />
      <section
        className={cn(
          className,
          'text-green-1000 flex flex-col gap-x-6 gap-y-2 px-4 py-6 md:flex-row md:px-10 lg:gap-x-24 lg:px-[120px] lg:py-24',
        )}
      >
        <HomeQuestions
          components={{
            a,
            h2,
            li: AccordionItem,
            p: UnwrapChild,
            ul: AccordionWrapper,
          }}
        />
      </section>
    </>
  );
}

const federationUL = (props: ComponentPropsWithoutRef<'ul'>) => {
  return <ul className="space-y-8" {...props} />;
};

const federationLI = (props: ComponentPropsWithoutRef<'li'>) => {
  const texts = Children.toArray(props.children).filter(child => child !== '\n');

  if (texts.length === 0) {
    return null;
  }

  if (texts.length < 2) {
    console.error(texts);
    throw new Error(`Expected a question and an answer, got ${texts.length} items`);
  }

  const [question, ...answers] = texts;

  if (!question) return null;

  return (
    <li itemProp="mainEntity" itemScope itemType="https://schema.org/Question">
      <h3 className="pb-2 text-left font-medium" itemProp="name">
        {question}
      </h3>
      <div
        className="mx-4 overflow-hidden bg-white text-green-800"
        itemProp="acceptedAnswer"
        itemScope
        itemType="https://schema.org/Answer"
      >
        <div className="max-w-[700px] space-y-2" itemProp="text">
          {answers.map((answer, i) => (
            <p key={i}>{answer}</p>
          ))}
        </div>
      </div>
    </li>
  );
};

export function FrequentlyAskedFederationQuestions({ className }: { className?: string }) {
  return (
    <>
      <AttachPageFAQSchema />
      <section
        className={cn(
          className,
          'text-green-1000 flex flex-col gap-8 px-4 py-6 md:px-14 lg:flex-row lg:px-[120px] lg:py-24',
        )}
      >
        <FederationQuestions
          components={{
            a,
            h2,
            li: federationLI,
            p: UnwrapChild,
            ul: federationUL,
          }}
        />
      </section>
    </>
  );
}

export function FrequentlyAskedPartnersQuestions({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        className,
        'text-green-1000 flex flex-col gap-x-6 gap-y-2 px-4 py-6 md:flex-row md:px-10 lg:gap-x-24 lg:px-[120px] lg:py-24',
      )}
    >
      <PartnersQuestions
        components={{
          a,
          h2,
          li: AccordionItem,
          p: UnwrapChild,
          ul: AccordionWrapper,
        }}
      />
    </section>
  );
}
