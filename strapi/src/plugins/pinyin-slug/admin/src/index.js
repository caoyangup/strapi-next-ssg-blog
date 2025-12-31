import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app) {
    app.customFields.register({
      name: "pinyin-slug",
      pluginId: "pinyin-slug",
      type: "string",
      intlLabel: {
        id: "pinyin-slug.form.label",
        defaultMessage: "Pinyin Slug",
      },
      intlDescription: {
        id: "pinyin-slug.form.description",
        defaultMessage: "Generate pinyin slug from a source field.",
      },
      components: {
        Input: async () =>
          import(
            /* webpackChunkName: "pinyin-slug-input-component" */ "./components/Input"
          ),
      },
      options: {
        // 自定义字段的选项
        base: [
          {
            sectionTitle: {
              id: 'pinyin-slug.options.title',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'options.sourceField',
                type: 'string',
                intlLabel: {
                  id: 'pinyin-slug.options.sourceField.label',
                  defaultMessage: 'Source Field',
                },
                description: {
                  id: 'pinyin-slug.options.sourceField.description',
                  defaultMessage: 'The field to generate the slug from (e.g., "title").',
                },
              },
            ],
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'pinyin-slug.options.advanced.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'pinyin-slug.options.advanced.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty",
                },
              },
              {
                name: 'unique',
                type: 'checkbox',
                intlLabel: {
                  id: 'pinyin-slug.options.advanced.unique',
                  defaultMessage: 'Unique field',
                },
                description: {
                  id: 'pinyin-slug.options.advanced.unique.description',
                  defaultMessage: 'This field value must be unique across all entries',
                },
              },
            ],
          },
        ]
      },
    });

    // app.addMenuLink({
    //   to: `plugins/${PluginIcon}`,
    //   icon: PluginIcon,
    //   intlLabel: {
    //     id: `${PLUGIN_ID}.plugin.name`,
    //     defaultMessage: PLUGIN_ID,
    //   },
    //   Component: async () => {
    //     const { App } = await import('./pages/App');

    //     return App;
    //   },
    // });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
