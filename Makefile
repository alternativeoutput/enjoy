BASE_ENV=$(HOME)/.virtualenvs
NAME_ENV_DEV=djchan
NAME_ENV_PROD=enjoy

checkvenv:
	@test -z "$(VIRTUAL_ENV)" || ( echo ; \
	    echo "Virtualenv '$(shell basename "$(VIRTUAL_ENV)")' is activated, deactivate before proceeding" \
	    ; echo ; false )

create_dev: checkenv
	@echo "CREATE DEV"
	@test ! -d "$(BASE_ENV)/$(NAME_ENV_DEV)" \
|| ( echo "Virtualenv '$(BASE_ENV)/$(NAME_ENV_DEV)' already exists" ; false )
	python3 -m virtualenv -p /usr/bin/python3.5 '$(BASE_ENV)/$(NAME_ENV_DEV)'
	. '$(BASE_ENV)/$(NAME_ENV_DEV)/bin/activate' \
	    && pip install --upgrade pip \
	    && pip install -r requirements_dev.txt

create_prod: checkvenv
	@echo "CREATE PROD"
	@test ! -d "$(BASE_ENV)/$(NAME_ENV_PROD)" \
|| ( echo "Virtualenv '$(BASE_ENV)/$(NAME_ENV_PROD)' already exists" ; false )
	python3 -m virtualenv -p /usr/bin/python3.5 '$(BASE_ENV)/$(NAME_ENV_PROD)'
	. '$(BASE_ENV)/$(NAME_ENV_PROD)/bin/activate' \
	    && pip install --upgrade pip \
	    && pip install -r requirements_prod.txt

destroy_dev:
	@echo "DESTROY DEV"
	deactivate || true
	test ! -d "$(BASE_ENV)/$(NAME_ENV_DEV)" || rm -rf "$(BASE_ENV)/$(NAME_ENV_DEV)"

destroy_prod:
	@echo "DESTROY PROD"
	deactivate || true
	test ! -d "$(BASE_ENV)/$(NAME_ENV_PROD)" || rm -rf "$(BASE_ENV)/$(NAME_ENV_PROD)"

recreate_dev: destroy_dev create_dev
recreate_prod: destroy_prod create_prod

.PHONY: checkvenv create_dev create_prod destroy_dev destroy_prod recreate_dev recreate_prod
