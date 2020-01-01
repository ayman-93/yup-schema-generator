import CreateDynamicSchema from '../index';
import * as yup from 'yup';

let json = [
  {
    validationType: 'string',
    name: 'DYN_serviceType',
    validations: [
      {
        type: 'required',
        params: ['الحقل مطلوب'],
      },
    ],
  },
];
let data = JSON.stringify(json);
let mySchemaData = CreateDynamicSchema(data);
let regularSchema = yup.object().shape({
  DYN_serviceType: yup.string().required(),
});

let mySchema = yup.object().shape(mySchemaData);
console.log('mySchema === schema::', mySchema.toString() === regularSchema.toString());

// test('My Schema', () => {
//     expect(CreateDynamicSchema(data)).toHaveReturnedWith(regularSchema);
// });
