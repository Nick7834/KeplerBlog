/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest', // БЕЗ ESM
  testEnvironment: "node",
  roots: ['<rootDir>/src'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  transform: {
    "^.+\\.tsx?$": "ts-jest", // БЕЗ useESM: true
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!(bcryptjs|@prisma|next-auth|nanoid)/)'], // Добавил nanoid
};
