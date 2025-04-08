import type { Config } from 'jest'

const config: Config = {
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1'
	},

  preset: 'ts-jest',
  testEnvironment: "jest-environment-node",
	verbose: true,
	testMatch: ["**/__tests__/**/*.test.ts"],
	setupFilesAfterEnv: ['./jest.setup.ts'],

	// transformIgnorePatterns: [ "node_modules/(?!slug)" ], 		// for slug package
}

export default config
