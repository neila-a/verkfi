.PHONY: dev build start lint push
dev:
	npx next dev
build:
	npx next build
start:
	npx next start
lint:
	npx next lint
push: 
	git add .
	git commit -a -m "来自Makefile的一次自动提交"
	git push origin main --tags