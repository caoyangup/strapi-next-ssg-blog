import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    description: '';
    displayName: 'Footer';
    icon: 'apps';
  };
  attributes: {
    copyright: Schema.Attribute.String;
    description: Schema.Attribute.String;
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    logoDark: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    nav: Schema.Attribute.Component<'nav.item', true>;
  };
}

export interface LayoutNavbar extends Struct.ComponentSchema {
  collectionName: 'components_layout_navbars';
  info: {
    displayName: 'Navbar';
    icon: 'bold';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    logoDark: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    logoText: Schema.Attribute.String;
    nav: Schema.Attribute.Component<'nav.item', true>;
    navMobile: Schema.Attribute.Component<'nav.item', true>;
  };
}

export interface NavItem extends Struct.ComponentSchema {
  collectionName: 'components_nav_items';
  info: {
    displayName: 'Item';
  };
  attributes: {
    desc: Schema.Attribute.String;
    href: Schema.Attribute.String;
    subItems: Schema.Attribute.Component<'nav.item-level-2', true>;
    text: Schema.Attribute.String;
  };
}

export interface NavItemLevel2 extends Struct.ComponentSchema {
  collectionName: 'components_nav_item_level_2s';
  info: {
    displayName: 'Item level 2';
  };
  attributes: {
    desc: Schema.Attribute.String;
    href: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface NavItemLevel3 extends Struct.ComponentSchema {
  collectionName: 'components_nav_item_level_3s';
  info: {
    displayName: 'Item level 3';
  };
  attributes: {
    desc: Schema.Attribute.String;
    href: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface NavTagLevel1 extends Struct.ComponentSchema {
  collectionName: 'components_nav_tag_level_1s';
  info: {
    displayName: 'tag level 1';
  };
  attributes: {
    adminName: Schema.Attribute.String & Schema.Attribute.Private;
    children: Schema.Attribute.Component<'nav.tag-level-2', true>;
  };
}

export interface NavTagLevel2 extends Struct.ComponentSchema {
  collectionName: 'components_nav_tag_level_2s';
  info: {
    displayName: 'tag level 2';
  };
  attributes: {
    adminName: Schema.Attribute.String;
    children: Schema.Attribute.Component<'nav.tag-level-3', true>;
  };
}

export interface NavTagLevel3 extends Struct.ComponentSchema {
  collectionName: 'components_nav_tag_level_3s';
  info: {
    displayName: 'tag level 3';
  };
  attributes: {
    adminName: Schema.Attribute.String;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    asChild: Schema.Attribute.Boolean;
    href: Schema.Attribute.String;
    prefetch: Schema.Attribute.Boolean;
    replace: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    scroll: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    size: Schema.Attribute.Enumeration<['default', 'sm', 'lg', 'icon']> &
      Schema.Attribute.DefaultTo<'default'>;
    target: Schema.Attribute.Enumeration<
      ['_blank', '_self', '_parent', '_top']
    >;
    text: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']
    > &
      Schema.Attribute.DefaultTo<'link'>;
  };
}

export interface SharedMetaSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_meta_socials';
  info: {
    description: '';
    displayName: 'metaSocial';
    icon: 'project-diagram';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 65;
      }>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    socialNetwork: Schema.Attribute.Enumeration<['Facebook', 'Twitter']> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images' | 'files' | 'videos'> &
      Schema.Attribute.Required;
    metaRobots: Schema.Attribute.String;
    metaSocial: Schema.Attribute.Component<'shared.meta-social', true>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    structuredData: Schema.Attribute.JSON;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.footer': LayoutFooter;
      'layout.navbar': LayoutNavbar;
      'nav.item': NavItem;
      'nav.item-level-2': NavItemLevel2;
      'nav.item-level-3': NavItemLevel3;
      'nav.tag-level-1': NavTagLevel1;
      'nav.tag-level-2': NavTagLevel2;
      'nav.tag-level-3': NavTagLevel3;
      'shared.link': SharedLink;
      'shared.meta-social': SharedMetaSocial;
      'shared.seo': SharedSeo;
    }
  }
}
