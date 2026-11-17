# DATABASE BACKUP & RESTORE GUIDE

This guide details automated and manual disaster recovery procedures for the **DIGITAL MARKET** database.

---

## 1. Automated PostgreSQL Dump Backup

Run `pg_dump` to create an encrypted or timestamped SQL dump of your PostgreSQL database:

### Linux / macOS / Bash:
```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# Using DATABASE_URL
pg_dump "$DATABASE_URL" -F c -b -v -f "$BACKUP_DIR/dm_backup_$TIMESTAMP.dump"

echo "✅ Backup created successfully: $BACKUP_DIR/dm_backup_$TIMESTAMP.dump"
```

### Windows PowerShell:
```powershell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "./backups"
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir }

# Replace connection string or use $env:DATABASE_URL
pg_dump $env:DATABASE_URL -F c -b -v -f "$backupDir/dm_backup_$timestamp.dump"
Write-Output "✅ Backup created: $backupDir/dm_backup_$timestamp.dump"
```

---

## 2. Restoration from Dump

To restore the database to an empty or recovered PostgreSQL instance:

```bash
# Drop & recreate database (CAUTION: Destructive!)
dropdb -h localhost -U postgres digital_market_db
createdb -h localhost -U postgres digital_market_db

# Restore from binary dump
pg_restore -h localhost -U postgres -d digital_market_db -v ./backups/dm_backup_YYYYMMDD_HHMMSS.dump
```

---

## 3. SQLite Local Database Backup (Development)

For the local development SQLite `dev.db`:
```bash
# Backup:
cp backend/prisma/dev.db backend/prisma/dev_backup.db

# Restore:
cp backend/prisma/dev_backup.db backend/prisma/dev.db
```
