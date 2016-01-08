export GOPATH=$(PWD)/API_server
export PATH=$(PATH):$(GOPATH)

save:
	cd ./API_server/src/API_server && godep save

install:
	cd ./API_server/src/API_server && godep restore -v

build:
	cd ./API_server/src/API_server && go install

run-server:
	cd ./API_server/src/API_server && $(GOPATH)/bin/API_server

run-client-dev:
	npm run dev

run-client-prod:
	npm run build && npm run start


