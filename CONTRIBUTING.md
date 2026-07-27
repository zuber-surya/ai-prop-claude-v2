# Contributing to Property Vista CRM MVP

Thank you for considering contributing to our project! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

Before submitting a bug report, please check if the issue has already been reported. If it hasn't, use the "Bug Report" issue template to submit a detailed report including:

- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots or logs if applicable
- Environment information

### Suggesting Features

If you have an idea for a new feature or improvement, please use the "Feature Request" issue template to submit your suggestion including:

- The problem the feature would solve
- Your proposed solution
- Any alternatives you've considered
- Priority level (if applicable)

### Submitting Changes

1. Fork the repository
2. Create a new branch from `develop`: `git checkout -b feat/your-feature-name develop`
3. Make your changes
4. Ensure your code follows our [coding standards](knowledge_base/development/CODING_STANDARDS.md)
5. Add or update tests as needed
6. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
7. Push to your fork and submit a pull request to the `develop` branch

### Pull Request Process

1. Update the README.md if needed with details of changes
2. Ensure all CI checks pass
3. Request review from at least one team member
4. Address any review comments
5. Once approved, your PR will be squashed and merged into `develop`
6. Regular merges from `develop` to `main` will trigger releases

## Development Setup

Please refer to the [Development Environment Setup](knowledge_base/project/TASKS.md#t010-development-environment-setup-documented) for detailed setup instructions.

## Coding Standards

Please follow our [coding standards](knowledge_base/development/CODING_STANDARDS.md) and ensure your code passes linting checks.

## Testing

- Write unit tests for new functionality
- Ensure new code has adequate test coverage (≥90% for critical paths)
- Run the full test suite before submitting PRs: `npm test`

## Git Workflow

We follow a [GitHub Flow](https://guides.github.com/introduction/flow/) variant:
- `main` branch contains production-ready code
- `develop` branch contains upcoming release code
- Feature branches are created from `develop`
- Pull requests target `develop`
- Releases are created from `main` after thorough testing

## Community

Please be respectful and considerate of others when contributing. See our [Code of Conduct](CODE_OF_CONDUCT.md) for more details.

## Questions?

If you have questions, please open an issue or reach out to the maintainers.