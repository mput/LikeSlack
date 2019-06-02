install:
	make install

start:
	NODE_ENV='development' DEBUG='chat:*' npx nodemon --exec npx babel-node server/bin/slack.js

build:
	rm -rf dist
	npm run build

run:
	DEBUG='chat*' node dist/bin/slack.js

test:
	npx jest

test-watch:
	DEBUG='chat:*' npx jest --watch

test-coverage:
	npx jest --coverage

lint:
	npx eslint --ext .js,.jsx .

migrate:
	npx knex migrate:latest
seed:
	npx knex seed:run
migrate-rollback:
	npx knex migrate:rollback

compose-up:
	docker-compose up -d

compose-down:
	docker-compose down

compose-bash:
	docker-compose exec web bash

compose-logs:
	docker-compose logs --tail=20 -f

compose-test-up:
	COMPOSE_PROJECT_NAME=lstest docker-compose -f ./docker-compose-test.yml up -d

compose-test-down:
	COMPOSE_PROJECT_NAME=lstest docker-compose -f ./docker-compose-test.yml down

.PHONY: test
