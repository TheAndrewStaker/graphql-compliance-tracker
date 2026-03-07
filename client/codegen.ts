import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: '../server/src/schema/schema.graphql',
  documents: 'src/graphql/**/*.graphql',
  generates: {
    'src/graphql/__generated__/types.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withResultType: true,
        withMutationFn: true,
        enumsAsTypes: true,
        avoidOptionals: false,
      },
    },
  },
};

export default config;
