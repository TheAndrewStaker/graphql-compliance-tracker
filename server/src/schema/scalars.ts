import { GraphQLScalarType, Kind } from 'graphql';

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'ISO-8601 date-time string',
  serialize(value: unknown): string {
    if (value instanceof Date) {return value.toISOString();}
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value).toISOString();
    }
    throw new Error('DateTime serialize: expected Date, string, or number');
  },
  parseValue(value: unknown): Date {
    if (typeof value === 'string' || typeof value === 'number') {
      return new Date(value);
    }
    throw new Error('DateTime parseValue: expected string or number');
  },
  parseLiteral(ast): Date {
    if (ast.kind === Kind.STRING) {return new Date(ast.value);}
    throw new Error('DateTime parseLiteral: expected StringValue');
  },
});
