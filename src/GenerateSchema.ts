import * as defaultYup from 'yup';
// const yup = require("yup");

const GenerateSchema = (
    schema: { [name: string]: any },
    config: {
        name: string;
        validationType: string;
        validations: [{ type: string; params: [] }];
        requiredIf: string;
        requiredIfValue: string[] | string;
        orValue?: string;
    }, customYup?: any
) => {
    const yup = customYup || defaultYup;
    const { name, validationType, validations = [] } = config;

    // check if the validationType (string,number..) is valid yup validator if it's not return the schema without this field validation.
    if (!(yup as any)[validationType]) {
        return schema;
    }

    let validator: { [type: string]: any };

    validator = (yup as any)[validationType]();

    // for each validation on validations
    validations.forEach(validation => {
        // destructuring the "params" and "type" from  "validation"
        let { params, type }: { params: any[]; type: string } = validation;

        // if no params key assign params to empty array.
        params = params || [];

        if (type === 'requiredIf') {
            // get the "fields" and "hasValues" from the "params" as separated arrays.
            const { fields, hasValues } = params.reduce(
                (acc, param) => {
                    acc.fields.push(param.field);
                    acc.hasValues.push(param.hasValue);
                    return acc;
                },
                { fields: [], hasValues: [] },
            );

            validator = (yup as any)[validationType]().when(fields, {
                is: (...values: any[]) => {
                    return values.every((value, index) => {
                        // if the field require on multiple values
                        if (Array.isArray(hasValues[index])) {
                            return hasValues[index].includes(value);
                        }
                        return value === hasValues[index];
                    });
                },
                // if the (is:) return a true the field will be required
                then: (yup as any)[validationType]().required(),
                // else not required
                otherwise: (yup as any)[validationType](),
            });
        } else if (type === 'matches') {
            // convert string to regex
            const reg = new RegExp(params[0]);
            // to remove the regex from the params
            params.shift();
            validator = validator.matches(reg, ...params);
        } else {
            validator = validator[type](...params);
        }
    });

    // add the new validator to the schema and return the schema.
    schema[name] = validator;
    return schema;
};

export default GenerateSchema;
