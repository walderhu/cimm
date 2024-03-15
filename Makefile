TEST_FILES = tests/*.py
ALL_FILES = src/*.py $(TEST_FILES)

test:
	@python3 $(TEST_FILES)

clean:
	@rm -rf __pycache__ .pytest_cache htmlcov .coverage

gcov:
	@python3 -m coverage run -m pytest $(TEST_FILES)
	@python3 -m coverage report

html: gcov
	@python3 -m coverage html
	@open htmlcov/index.html

clang:
	@autopep8 --in-place $(ALL_FILES)

push: clean
	@git add * && git commit && git push origin $(shell git rev-parse --abbrev-ref HEAD)