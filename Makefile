install: install-deps install-flow-typed

start:
	NODE_ENV='development' npx nodemon --exec npx babel-node server/bin/slack.js

build:
	rm -rf dist
	npm run build

run:
	node dist/bin/slack.js

test:
	npx jest

test-watch:
	npx jest --watch

test-coverage:
	npx jest --coverage

lint:
	npx eslint --ext .js,.jsx .

.PHONY: test
