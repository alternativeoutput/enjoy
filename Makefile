BASE_ENV=$(HOME)/.virtualenvs
NAME_ENV=djchan

create:
	@echo "CREATE"
	@test ! -d "$(BASE_ENV)/$(NAME_ENV)" \
|| ( echo "Virtualenv '$(BASE_ENV)/$(NAME_ENV)' already exists" ; false )
	python3 -m virtualenv -p /usr/bin/python3.5 '$(BASE_ENV)/$(NAME_ENV)'
	. '$(BASE_ENV)/$(NAME_ENV)/bin/activate' && pip install --upgrade pip


destroy:
	@echo "DESTROY"
	deactivate || true
	test ! -d "$(BASE_ENV)/$(NAME_ENV)" || rm -rf "$(BASE_ENV)/$(NAME_ENV)"

recreate: destroy create

.PHONY: create destroy recreate
