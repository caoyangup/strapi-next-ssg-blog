// https://docs.strapi.io/cms/features/custom-fields#usage
import React from 'react';
import { pinyin } from 'pinyin';
import { useIntl } from 'react-intl';
// Strapi V4.15+ a changé la façon dont on accède au contexte, nous le conservons tel quel.
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin';

import {
    Field,
    Flex,
} from '@strapi/design-system';
import { ArrowClockwise } from '@strapi/icons';


const Input = React.forwardRef((props, ref) => {
    const { attribute, disabled, intlLabel, labelAction, name, onChange, required, value, hint, label, error } =
        props; // these are just some of the props passed by the content-manager 
    const { formatMessage } = useIntl();
    const { form } = useContentManagerContext();
    const sourceField = attribute.options.sourceField || 'title';
    const handleGenerateSlug = () => {
        const sourceText = form.values[sourceField]
        if (!sourceText) {
            // 你也可以使用 Strapi 的通知系统来提示
            alert(formatMessage(
                {
                    id: 'pinyin-slug.alert.source-field-missing',
                    defaultMessage: 'Please fill the "{sourceField}" field first.',
                },
                { sourceField }
            ));
            return;
        }

        // --- 核心逻辑：直接在前端生成拼音 slug ---
        const pinyinArray = pinyin(sourceText, {
            style: 'normal', // e.g., '你' -> 'ni'
            segment: true, // 启用分词
            group: true, // 启用词组
        });

        const newSlug = pinyinArray
            .map((item) => item[0])
            .join('-')
            .toLowerCase()
            // 替换所有非字母数字的字符为'-'
            .replace(/[^a-z0-9-]/g, '-')
            // 移除重复的'-'
            .replace(/-+/g, '-');
        // ------------------------------------------

        // 使用 Strapi 提供的 onChange 函数来更新字段值
        onChange({ target: { name, value: newSlug, type: 'string' } });
    };

    return (

        <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
            <Flex direction="column" alignItems="stretch" gap={1}>
                <Field.Label action={labelAction}>{label}</Field.Label>
                <Field.Input
                    ref={ref}
                    name={name}
                    disabled={disabled}
                    value={value}
                    required={required}
                    onChange={onChange}
                    endAction={
                        < ArrowClockwise
                            onClick={handleGenerateSlug}
                            label={formatMessage({
                                id: 'pinyin-slug.button.regenerate',
                                defaultMessage: 'Regenerate slug',
                            })}
                            style={{
                                cursor: 'pointer',
                            }}
                        />
                    } />
                <Field.Hint />
                <Field.Error />
            </Flex>
        </Field.Root>
    );
});

export default Input;