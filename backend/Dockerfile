FROM golang:1.22

WORKDIR /usr/src/app

COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .

EXPOSE 8888

CMD ["go", "run", "."]
