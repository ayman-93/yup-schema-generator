import GenerateSchema from './GenerateSchema';

export const CreateDynamicSchema = (config: [] | string, customYup?: any) => {
    let configArray: [];
    if (!Array.isArray(config)) {
        configArray = JSON.parse(config);
    } else {
        configArray = config;
    }
    return configArray.reduce((schema, config) => GenerateSchema(schema, config, customYup), {});
};
