#!/usr/bin/env bash
set -e 

export PGPASSWORD=root
psql -f /init_script.sql -U postgres
	