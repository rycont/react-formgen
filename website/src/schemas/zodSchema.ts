import { z } from 'zod/v4'

// prettier-ignore
const US_STATE_CODES =  [
  "AL", "AK", "AS", "AZ", "AR",
  "CA", "CO", "CT", "DE", "DC",
  "FM", "FL", "GA", "GU", "HI",
  "ID", "IL", "IN", "IA", "KS",
  "KY", "LA", "ME", "MH", "MD",
  "MA", "MI", "MN", "MS", "MO",
  "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "MP",
  "OH", "OK", "OR", "PW", "PA",
  "PR", "RI", "SC", "SD", "TN",
  "TX", "UT", "VT", "VI", "VA",
  "WA", "WV", "WI", "WY",
] as const

const PROPERTY_TYPES = [
  'Single Family Home',
  'Townhouse',
  'Condo',
  'Apartment',
  'Other',
] as const

export const addressSchema = z
  .tuple([
    z
      .string()
      .meta({ title: 'Street Address', description: 'The street address.' }),
    z.string().meta({ title: 'City', description: 'The city.' }),
    z.enum(US_STATE_CODES).meta({
      title: 'State',
      description:
        'The state. This field has an enum, so it will render as a select input.',
    }),
    z
      .string()
      .regex(/^[0-9]{5}(?:-[0-9]{4})?$/)
      .min(5)
      .max(10)
      .meta({ title: 'Zip Code', description: 'The zip code.' }),
    z
      .enum(PROPERTY_TYPES)
      .default('Single Family Home')
      .meta({
        title: 'Property Type',
        description: 'The type of property.',
        uiSchema: { component: 'multipleChoice' },
      }),
  ])
  .meta({
    title: 'Address',
    description: 'An tuple containing the street address, city, and state.',
  })

export const friendSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .max(100)
      .meta({ title: 'Name', description: "The friend's name." }),
    age: z
      .number()
      .int()
      .min(0)
      .max(150)
      .optional()
      .meta({ title: 'Age', description: "The friend's age." }),
    ageAlt: z
      .number()
      .min(0)
      .max(150)
      .default(30)
      .meta({
        title: 'Age (Alt)',
        description: "The friend's age, but rendered as a range input.",
        uiSchema: { component: 'range' },
      }),
    address: addressSchema.meta({
      title: 'Address',
      description: "The friend's address.",
    }),
  })

  .meta({ title: 'Friend', description: 'An object representing a friend.' })

export const zodSchema = z
  .object({
    firstName: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[A-Za-z]+$/)
      .meta({
        title: 'First Name',
        description: "The person's first name.",
      }),
    lastName: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[A-Za-z]+$/)
      .meta({
        title: 'Last Name',
        description: "The person's last name.",
      }),
    age: z.number().int().min(0).max(150).optional().meta({
      title: 'Age',
      description: "The person's age.",
    }),
    email: z.email().meta({
      title: 'Email',
      description: "The person's email address.",
    }),
    phone: z.string().optional().meta({
      title: 'Phone',
      description: "The person's phone number.",
    }),
    ssn: z.string().optional().meta({
      title: 'SSN',
      description: "The person's social security number.",
    }),
    homepage: z.string().url().optional().meta({
      title: 'Homepage',
      description: "The person's homepage URL.",
    }),
    birthday: z.date().optional().meta({
      title: 'Birthday',
      description: "The person's birthday.",
    }),

    is_active: z
      .boolean()
      .optional()
      .meta({
        title: 'Is Active',
        description:
          'Indicates whether the person is active. Defined using schema composition via `oneOf`, each boolean value (`true` or `false`) is paired with a `title` for clarity. Renders as a radio input.',
        oneOf: [
          { title: 'Yes', const: true },
          { title: 'No', const: false },
        ],
      }),
    loves_cats: z.boolean().optional().meta({
      title: 'Loves Cats',
      description:
        'Indicates whether the person loves cats. This field has no complex definition, so it will render as a checkbox input.',
    }),
    loves_dogs: z.boolean().optional().meta({
      title: 'Loves Dogs',
      description:
        'Indicates whether the person loves dogs. This field has no complex definition, so it will render as a checkbox input.',
    }),
    loves_pizza: z
      .boolean()
      .default(true)
      .meta({
        title: 'Loves Pizza',
        description:
          'Indicates whether the person loves pizza. Defined using schema composition via `oneOf`, each boolean value (`true` or `false`) is paired with a `title` for clarity. Renders as a radio input.',
        oneOf: [
          { title: '🍕', const: true },
          { title: '🙅‍♂️', const: false },
        ],
      }),
    loves_tacos: z
      .boolean()
      .optional()
      .meta({
        title: 'Loves Tacos',
        description:
          'Indicates whether the person loves tacos. Defined using schema composition via `oneOf`, each boolean value (`true` or `false`) is paired with a `title` for clarity. Renders as a radio input.',
        oneOf: [
          { title: '🌮', const: true },
          { title: '🙅‍♂️', const: false },
        ],
      }),
    favorite_foods: z
      .array(
        z.union([
          z.literal('Pizza').meta({ title: '🍕 Pizza' }),
          z.literal('Burger').meta({ title: '🍔 Burgers' }),
          z.literal('Tacos').meta({ title: '🌮 Tacos' }),
          z.literal('Sushi').meta({ title: '🍣 Sushi' }),
        ]),
      )
      .min(1)
      .refine((arr) => new Set(arr).size === arr.length, {
        message: 'Items must be unique',
      })
      .optional()
      .meta({
        title: 'Favorite Foods',
        description:
          'A list of favorite foods, unique and selected from predefined options.',
        uiSchema: { component: 'checkbox' },
      }),

    favorite_foods_alt: z
      .array(
        z.union([
          z.literal('Pizza').meta({ title: '🍕 Pizza' }),
          z.literal('Burger').meta({ title: '🍔 Burgers' }),
          z.literal('Tacos').meta({ title: '🌮 Tacos' }),
          z.literal('Sushi').meta({ title: '🍣 Sushi' }),
        ]),
      )
      .min(1)
      .refine((arr) => new Set(arr).size === arr.length, {
        message: 'Items must be unique',
      })
      .optional()
      .meta({
        title: 'Favorite Foods (Alt)',
        description:
          'A list of favorite foods, unique and selected from predefined options, but rendered as a multi-select dropdown.',
        uiSchema: { component: 'multiSelect' },
      }),

    address: addressSchema.meta({
      title: 'Address',
      description: "The person's address.",
    }),
    friends: z.array(friendSchema).optional().meta({
      title: 'Friends',
      description: "A list of the person's friends.",
    }),
    employment: z
      .object({
        employer: z
          .string()
          .meta({ title: 'Employer', description: "The person's employer." }),
        role: z
          .string()
          .meta({ title: 'Role', description: "The person's role." }),
        start_date: z.date().meta({
          title: 'Start Date',
          description: 'The date the person started the role.',
        }),
        end_date: z.date().optional().meta({
          title: 'End Date',
          description: 'The date the person ended the role.',
        }),
        address: addressSchema.meta({
          title: 'Address',
          description: 'The address of the employment location.',
        }),
      })
      .optional()
      .meta({
        title: 'Employment',
        description: "The person's employment details.",
      }),
    projects: z
      .array(
        z
          .object({
            name: z
              .string()
              .meta({ title: 'Name', description: 'The name of the project.' }),
            description: z.string().meta({
              title: 'Description',
              description: 'The description of the project.',
              uiSchema: { component: 'textarea' },
            }),
            start_date: z.date().meta({
              title: 'Start Date',
              description: 'The date the project started.',
            }),
            end_date: z.date().optional().meta({
              title: 'End Date',
              description: 'The date the project ended.',
            }),
            team: z.array(friendSchema).optional().meta({
              title: 'Team',
              description: 'The team members involved in the project.',
            }),
          })
          .meta({
            title: 'Project',
            description: 'An object representing a project.',
          }),
      )
      .min(0)
      .optional()
      .meta({
        title: 'Projects',
        description: "A list of the person's projects.",
      }),
  })
  .meta({
    title: 'Example Schema',
    description:
      'A schema representing a complex object with various features.',
  })

export const zodSchemaBasic = z
  .object({
    firstName: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[A-Za-z]+$/)
      .meta({
        title: 'First Name',
        description: "The person's first name.",
      }),
    lastName: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[A-Za-z]+$/)
      .meta({
        title: 'Last Name',
        description: "The person's last name.",
      }),
    age: z.number().int().min(0).max(150).optional().meta({
      title: 'Age',
      description: "The person's age.",
    }),
    email: z.email().meta({
      title: 'Email Address',
      description: "The person's email address.",
    }),
  })
  .meta({ title: 'User Form', description: 'A simple user form' })
