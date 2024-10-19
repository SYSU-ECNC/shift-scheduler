DATABASE_URL ?= postgresql://postgres:password@localhost:5432/shift_scheduler_db?sslmode=disable

.PHONY: new_migration
new_migration:
	@migrate create -ext sql -dir migrations -seq $(filter-out $@,$(MAKECMDGOALS))

.PHONY: migrate_up
migrate_up:
	@migrate -database $(DATABASE_URL) -path migrations up $(filter-out, $@,$(MAKECMDGOALS))

.PHONY: migrate_down
migrate_down:
	@migrate -database $(DATABASE_URL) -path migrations down $(filter-out, $@,$(MAKECMDGOALS))

%:
	@: