TEST_FILE = ArrayHelperUnit.py

test:
	@python3 $(TEST_FILE)

clean:
	@rm -rf __pycache__ .pytest_cache htmlcov .coverage

gcov:
	@python3 -m coverage run -m pytest $(TEST_FILE)
	@python3 -m coverage report

html: gcov
	@python3 -m coverage html
	@open htmlcov/index.html

clang:
	@autopep8 --in-place *.py

push: clean
	@git add ../* && git commit && git push origin $(shell git rev-parse --abbrev-ref HEAD)