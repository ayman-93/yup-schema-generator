import GenerateSchema from './GenerateSchema';

export const CreateDynamicSchema = (config: [] | string) => {
  let configArray: [];
  if (!Array.isArray(config)) {
    configArray = JSON.parse(config);
  } else {
    configArray = config;
  }
  return configArray.reduce(GenerateSchema, {});
};
