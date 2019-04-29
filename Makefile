install:
	make install

start:
	NODE_ENV='development' DEBUG='chat:*' npx nodemon --exec npx babel-node server/bin/slack.js

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

migrate:
	npx knex migrate:latest
seed:
	npx knex seed:run

migrate-rollback:
	npx knex migrate:rollback

compose-up:
	docker-compose up

compose-down:
	docker-compose down

compose-install:
	docker-compose run web make install

compose-test-prepare:
	COMPOSE_PROJECT_NAME=lstest docker-compose -f ./docker-compose-test.yml run --rm web_test npm install

compose-test-coverage:
	COMPOSE_PROJECT_NAME=lstest docker-compose -f ./docker-compose-test.yml run --rm web_test make test-coverage

compose-test-watch:
	COMPOSE_PROJECT_NAME=lstest docker-compose -f ./docker-compose-test.yml run --rm web_test cd /code && make test-watch

compose-bash:
	docker-compose exec web bash

compose-migrate:
	docker-compose run web make migrate

compose-seed:
	docker-compose run web make seed

compose-build:
	docker-compose run web make build

compose-logs:
	docker-compose logs --tail=20 -f

compose-prepare: compose-install compose-migrate compose-seed


.PHONY: test
