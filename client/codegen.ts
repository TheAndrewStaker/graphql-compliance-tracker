import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../server/src/schema/schema.graphql',
  documents: 'src/graphql/**/*.graphql',
  generates: {
    'src/graphql/__generated__/': {
      preset: 'client',
      config: {
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
