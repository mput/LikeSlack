install: install-deps install-flow-typed

start:
	NODE_ENV='development' npx nodemon --exec npx babel-node server/bin/slack.js

run:
	node dist/bin/slack.js

install-deps:
	npm install

build:
	rm -rf dist
	npm run build

test:
	npx jest

test-coverage:
	npx jest --coverage

check-types:
	npx flow

lint:
	npx eslint --ext .js,.jsx .

publish:
	npm publish

.PHONY: test
