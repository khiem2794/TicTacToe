export GOPATH=$(PWD)/API_server

save:
	cd ./API_server/src/API_server && godep save -r

install:
	cd ./API_server/src/API_server && go get ./...

build:
	cd ./API_server/src/API_server && go install

run-server:
	cd ./API_server/src/API_server && $(GOPATH)/bin/API_server

run-client-dev:
	npm run dev

run-client-prod:
	npm run start


