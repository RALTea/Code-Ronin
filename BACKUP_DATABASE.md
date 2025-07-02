# Backup the database
```cmd
/opt/homebrew/opt/postgresql@16/bin/pg_dump --disable-triggers --no-owner --no-acl -Fc -h {{host}} -U {{user}} -d {{database}} --port={{port}} > backup.sql
```

# Restore the database
## Create database
If inserting into a new database, you can use the following command
```cmd
/opt/homebrew/opt/postgresql@16/bin/createdb -U {{user}} -h {{host}} --port={{port}} {{database}}
```

## Insert backup
```cmd
/opt/homebrew/opt/postgresql@16/bin/pg_restore --disable-triggers --no-owner --no-acl -U {{user}} -d {{database}} -h {{host}} --port={{port}} backup.sql
```