TRASH = __pycache__ .pytest_cache htmlcov .coverage
TEST_FILES = UnitArrayHelper.py
test:
	@python3 testing/unit.py

clean:
	@rm -rf $(TRASH) testing/$(TRASH) source/$(TRASH)

gcov:
	@python3 -m coverage run -m pytest testing/$(TEST_FILES)
	@python3 -m coverage report

html: 
	@python3 -m coverage run -m pytest testing/$(TEST_FILES)
	@python3 -m coverage html
	@open htmlcov/index.html

clang:
	@autopep8 --in-place src/*

push: clean
	@git add * && git commit && git push origin $(shell git rev-parse --abbrev-ref HEAD)
