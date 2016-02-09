FROM golang:1.5.3

MAINTAINER khiem

ADD . /usr/caro/
ENTRYPOINT /usr/caro
RUN go get github.com/tools/godep
RUN make install
RUN make build
CMD make run-server
EXPOSE 3030
