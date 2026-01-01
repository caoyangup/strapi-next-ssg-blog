const register = ({ strapi }) => {
  // 只需注册自定义字段类型
  strapi.customFields.register({
    name: 'pinyin-slug',
    plugin: 'pinyin-slug',
    type: 'string',
  });
};

export default register;
