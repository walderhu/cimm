TEST = _UnitArrayHelper.py
ALL_FILES = *.py

test:
	@python3 _UnitAtom.py

testing:
	@python3 $(TEST)

clean:
	@rm -rf __pycache__ .pytest_cache htmlcov .coverage

gcov:
	@python3 -m coverage run -m pytest $(TEST)
	@python3 -m coverage report

html: gcov
	@python3 -m coverage html
	@open htmlcov/index.html

clang:
	@autopep8 --in-place $(ALL_FILES)

push: clean
	@git add * && git commit && git push origin $(shell git rev-parse --abbrev-ref HEAD)