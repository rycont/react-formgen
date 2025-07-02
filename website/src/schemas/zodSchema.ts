import { z } from 'zod/v4'

// prettier-ignore
const US_STATE_CODES = [
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

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const

const PROGRAMMING_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C++',
  'Rust',
  'Go',
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
    description: 'A tuple containing the street address, city, and state.',
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
    // === STRING TEMPLATES ===
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
    bio: z
      .string()
      .min(10)
      .max(500)
      .optional()
      .meta({
        title: 'Bio',
        description: 'A short biography. This field uses textarea component.',
        uiSchema: { component: 'textarea' },
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

    // === NUMBER TEMPLATES ===
    age: z.number().int().min(0).max(150).optional().meta({
      title: 'Age',
      description: "The person's age.",
    }),
    ageRange: z.number().int().min(18).max(65).default(25).meta({
      title: 'Age Range',
      description: 'Age with automatic range detection (has min/max).',
    }),
    preferredTemperature: z
      .number()
      .min(60)
      .max(80)
      .default(72)
      .meta({
        title: 'Preferred Temperature',
        description: 'Temperature preference using explicit range component.',
        uiSchema: { component: 'range' },
      }),
    salary: z.number().min(30000).max(200000).optional().meta({
      title: 'Annual Salary',
      description: 'Salary range with automatic range detection.',
    }),

    // === BIGINT TEMPLATES ===
    largeNumber: z.bigint().optional().meta({
      title: 'Large Number',
      description: 'A large number using BigInt.',
    }),
    largeNumberRange: z.bigint().min(1000n).max(10000n).default(5000n).meta({
      title: 'Large Number Range',
      description: 'BigInt with automatic range detection (has min/max).',
    }),
    assetValue: z
      .bigint()
      .min(1000000n)
      .max(1000000000n)
      .optional()
      .meta({
        title: 'Asset Value',
        description: 'Asset value using explicit BigInt range component.',
        uiSchema: { component: 'range' },
      }),

    // === DATE TEMPLATES ===
    birthday: z.date().optional().meta({
      title: 'Birthday',
      description: "The person's birthday.",
    }),
    dateRange: z
      .date()
      .min(new Date('2020-01-01'))
      .max(new Date('2030-12-31'))
      .optional()
      .meta({
        title: 'Project Date Range',
        description: 'Date with automatic range detection (has min/max).',
      }),
    appointmentDateTime: z
      .date()
      .optional()
      .meta({
        title: 'Appointment Date & Time',
        description: 'Date and time selection using datetime component.',
        uiSchema: { component: 'datetime' },
      }),
    eventDateRange: z
      .date()
      .min(new Date('2024-01-01'))
      .max(new Date('2024-12-31'))
      .optional()
      .meta({
        title: 'Event Date Range',
        description: 'Date range using explicit range component.',
        uiSchema: { component: 'range' },
      }),

    // === BOOLEAN TEMPLATES ===
    is_active: z
      .boolean()
      .optional()
      .meta({
        title: 'Is Active',
        description:
          'Indicates whether the person is active. Uses oneOf for radio buttons.',
        oneOf: [
          { title: 'Yes', const: true },
          { title: 'No', const: false },
        ],
      }),
    loves_cats: z.boolean().optional().meta({
      title: 'Loves Cats',
      description: 'Simple boolean rendered as checkbox (default).',
    }),
    loves_dogs: z.boolean().optional().meta({
      title: 'Loves Dogs',
      description: 'Simple boolean rendered as checkbox (default).',
    }),
    loves_pizza: z
      .boolean()
      .default(true)
      .meta({
        title: 'Loves Pizza',
        description: 'Boolean with oneOf titles rendered as radio buttons.',
        oneOf: [
          { title: '🍕', const: true },
          { title: '🙅‍♂️', const: false },
        ],
      }),
    newsletter_subscription: z
      .boolean()
      .optional()
      .meta({
        title: 'Newsletter Subscription',
        description: 'Boolean with explicit radio component.',
        uiSchema: { component: 'radio' },
        oneOf: [
          { title: 'Subscribe', const: true },
          { title: 'Unsubscribe', const: false },
        ],
      }),

    // === ENUM TEMPLATES ===
    skill_level: z.enum(SKILL_LEVELS).optional().meta({
      title: 'Skill Level',
      description: 'Enum rendered as select dropdown (default).',
    }),
    favorite_language: z
      .enum(PROGRAMMING_LANGUAGES)
      .optional()
      .meta({
        title: 'Favorite Programming Language',
        description: 'Enum rendered as radio buttons.',
        uiSchema: { component: 'radio' },
      }),

    // === UNION TEMPLATES ===
    contact_method: z
      .union([
        z.literal('email'),
        z.literal('phone'),
        z.literal('mail'),
        z.literal('in-person'),
      ])
      .optional()
      .meta({
        title: 'Preferred Contact Method',
        description: 'Literal union rendered as radio buttons.',
      }),

    priority: z
      .union([
        z.literal('low').meta({ title: '🟢 Low' }),
        z.literal('medium').meta({ title: '🟡 Medium' }),
        z.literal('high').meta({ title: '🔴 High' }),
        z.literal('urgent').meta({ title: '🚨 Urgent' }),
      ])
      .optional()
      .meta({
        title: 'Priority Level',
        description: 'Literal union with custom titles.',
      }),

    // Complex union (different types)
    identifier: z
      .union([
        z.string().email().meta({ title: 'Email Address' }),
        z
          .string()
          .regex(/^\+?[1-9]\d{1,14}$/)
          .meta({ title: 'Phone Number' }),
        z.number().int().positive().meta({ title: 'User ID' }),
      ])
      .optional()
      .meta({
        title: 'User Identifier',
        description: 'Complex union with different types.',
      }),

    // === ARRAY TEMPLATES ===
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
          'Array of literals auto-detected as checkbox multi-select.',
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
        title: 'Favorite Foods (Dropdown)',
        description: 'Array of literals using explicit multi-select dropdown.',
        uiSchema: { component: 'multiSelect' },
      }),

    hobbies: z
      .array(
        z.union([
          z.literal('Reading').meta({ title: '📚 Reading' }),
          z.literal('Gaming').meta({ title: '🎮 Gaming' }),
          z.literal('Cooking').meta({ title: '👨‍🍳 Cooking' }),
          z.literal('Sports').meta({ title: '⚽ Sports' }),
          z.literal('Music').meta({ title: '🎵 Music' }),
          z.literal('Travel').meta({ title: '✈️ Travel' }),
        ]),
      )
      .optional()
      .meta({
        title: 'Hobbies (Checkbox)',
        description: 'Array using explicit checkbox component.',
        uiSchema: { component: 'checkbox' },
      }),

    skills: z.array(z.string()).optional().meta({
      title: 'Skills',
      description: 'Simple string array.',
    }),

    // === TUPLE TEMPLATE ===
    address: addressSchema.meta({
      title: 'Address',
      description: "The person's address.",
    }),

    coordinates: z
      .tuple([z.number(), z.number()])
      .optional()
      .meta({
        title: 'GPS Coordinates',
        description: 'Latitude and longitude as a tuple.',
        uiSchema: { props: { columns: 2 } },
      }),

    // === NESTED OBJECTS AND ARRAYS ===
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
        is_remote: z.boolean().default(false).meta({
          title: 'Remote Work',
          description: 'Is this a remote position?',
        }),
        salary_range: z
          .number()
          .min(30000)
          .max(300000)
          .optional()
          .meta({
            title: 'Salary Range',
            description: 'Annual salary range.',
            uiSchema: { component: 'range' },
          }),
        address: addressSchema.meta({
          title: 'Work Address',
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
            status: z
              .enum(['planning', 'active', 'completed', 'cancelled'])
              .meta({
                title: 'Project Status',
                description: 'Current status of the project.',
              }),
            priority: z
              .union([
                z.literal('low').meta({ title: 'Low Priority' }),
                z.literal('medium').meta({ title: 'Medium Priority' }),
                z.literal('high').meta({ title: 'High Priority' }),
              ])
              .default('medium')
              .meta({
                title: 'Priority',
                description: 'Project priority level.',
              }),
            budget: z.bigint().min(1000n).max(1000000n).optional().meta({
              title: 'Budget',
              description: 'Project budget range.',
            }),
            start_date: z.date().meta({
              title: 'Start Date',
              description: 'The date the project started.',
            }),
            end_date: z.date().optional().meta({
              title: 'End Date',
              description: 'The date the project ended.',
            }),
            is_public: z.boolean().default(false).meta({
              title: 'Public Project',
              description: 'Is this project publicly visible?',
            }),
            team: z.array(friendSchema).optional().meta({
              title: 'Team',
              description: 'The team members involved in the project.',
            }),
            technologies: z
              .array(
                z.union([
                  z.literal('React').meta({ title: 'React' }),
                  z.literal('Vue').meta({ title: 'Vue.js' }),
                  z.literal('Angular').meta({ title: 'Angular' }),
                  z.literal('Node.js').meta({ title: 'Node.js' }),
                  z.literal('Python').meta({ title: 'Python' }),
                  z.literal('Java').meta({ title: 'Java' }),
                ]),
              )
              .optional()
              .meta({
                title: 'Technologies',
                description: 'Technologies used in this project.',
                uiSchema: { component: 'multiSelect' },
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
    title: 'Comprehensive Example Schema',
    description:
      'A schema demonstrating all available template features in react-formgen.',
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
