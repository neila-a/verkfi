.PHONY: dev build start lint push commit
dev:
	next dev
build:
	next build
start:
	next start
lint:
	next lint
push:
	make commit
	git push --force
commit:
	git add .
	git commit -a -m "来自Makefile的一次自动提交"