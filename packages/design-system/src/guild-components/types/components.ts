import { ComponentProps, ReactElement, ReactNode } from 'react';

// Simplified image props (was next/image)
export interface IImage {
  alt: string;
  className?: string;
  height?: number;
  src: string;
  width?: number;
}

interface IVideo {
  placeholder: string;
  src: string;
}

// Simplified video props (was react-player)
export interface ReactPlayerProps {
  controls?: boolean;
  height?: number | string;
  loop?: boolean;
  muted?: boolean;
  playing?: boolean;
  url?: string;
  width?: number | string;
}

export type ILink = Pick<ComponentProps<'a'>, 'className' | 'onClick' | 'rel' | 'style' | 'target' | 'title'> & {
    children: ReactNode;
    newWindow?: boolean;
  } & {
  href: { pathname?: string } | string;
};

export interface IFeatureListProps {
  className?: string;
  description?: string;
  items: {
    description: string;
    image: IImage;
    link?: ILink;
    title: string;
  }[];
  link?: ILink;
  title?: string;
}

export interface IInfoListProps {
  className?: string;
  items: {
    description: ReactNode | string;
    link?: ILink;
    title: ReactNode | string;
  }[];
  title?: ReactNode | string;
}

export interface IHeroVideoProps {
  className?: string;
  description: ReactNode | string;
  flipped?: boolean;
  link?: ILink;
  title: ReactNode | string;
  video: IVideo;
  videoProps?: ReactPlayerProps;
}

export interface IHeroIllustrationProps {
  className?: string;
  description: ReactNode | string;
  flipped?: boolean;
  image: IImage;
  link?: ILink;
  title: ReactNode | string;
}

export interface IHeroGradientProps {
  className?: string;
  colors?: string[];
  description: ReactNode | string;
  image?: IImage;
  link?: ILink | ILink[];
  title: ReactNode | string;
  version?: ReactNode | string;
}

export interface IHeroMarketplaceProps {
  className?: string;
  description: ReactNode | string;
  image?: IImage;
  link: ILink;
  title: ReactNode | string;
}

export interface IMarketplaceItemProps {
  description: ReactNode | string;
  image: IImage;
  link: Omit<ILink, 'children'>;
  modal?: {
    content: (() => ReactNode) | ReactNode | string;
    header: {
      description?: ILink | string;
      image?: IImage;
    };
  };
  tags?: string[];
  title: string;
  update: string;
  weeklyNPMDownloads?: number;
}

export interface IMarketplaceItemsProps {
  items: IMarketplaceItemProps[];
}

export interface IMarketplaceListProps {
  className?: string;
  colorScheme?: 'green' | 'neutral';
  items: IMarketplaceItemProps[];
  pagination: number;
  placeholder: ReactElement | string;
  title?: string;
}

export interface IMarketplaceSearchProps {
  className?: string;
  colorScheme?: 'green' | 'neutral';
  placeholder: string;
  primaryList: IMarketplaceListProps;
  queryList?: IMarketplaceListProps;
  secondaryList?: IMarketplaceListProps;
  tagsFilter?: readonly string[] | string[];
  title: ReactNode | string;
}

export interface ISchemaPageProps {
  editorData: Omit<IEditorProps, 'children' | 'icon'>[];
  schemaName: string;
  tags?: string[];
}

export interface IEditorProps {
  children: ReactNode;
  frameworks?: string[];
  image?: string;
  operations?: string;
  schema?: string;
  title: string;
}
